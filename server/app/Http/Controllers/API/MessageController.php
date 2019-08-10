<?php

namespace App\Http\Controllers\API;

use App\Consultation;
use Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MessageController extends Controller
{
    public function fetch(Request $request, $id)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $validator = Validator::make(['consultation' => $id], [
            'consultation' => [
                'required',
                'exists:consultations,id'
            ],
        ]);
  
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 400);
        }

        $consultation = Consultation::find($id);

        if ($consultation->doctor_id !== $user->id && $consultation->patient_id !== $user->id) {
            return response()->json([
                'error' => 'Oops you can only modify your consultation',
            ], 400);
        }

        $consultationDurationMinutes = (int) env("CONSULTATION_DURATION_MINUTES");

        $consultationEndTime = strtotime('+'.$consultationDurationMinutes.' minutes', strtotime($consultation->start_time));
        
        if (time() >= $consultationEndTime) {
            $consultation->status = 'closed';
            $consultation->save();
        }

        return response()->json([
            'consultation' => $consultation,
            'messages' => $consultation->messages,
        ], 400);
    }
}
