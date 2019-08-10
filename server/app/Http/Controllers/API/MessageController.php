<?php

namespace App\Http\Controllers\API;

use App\Consultation;
use App\Message;
use Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MessageController extends Controller
{
    public function store(Request $request, $id)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $inputs = array_merge($request->input(), ['consultation' => $id]);

        $validator = Validator::make($inputs, [
            'consultation' => [
                'required',
                'exists:consultations,id'
            ],
            'type' => [
                'required',
                Rule::in(['text','image']),
            ],
            'message' => [
                'required_if:type,text',
                'string',
            ],
            'image' => [
                'required_if:type,image',
                'mimes:jpeg,png,jpg,gif,bmp',
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
                'error' => 'Oops you can only send messages in your own consultation',
            ], 400);
        }

        if ($consultation->status !== 'accepted') {
            return response()->json([
                'error' => 'Oops unable to send message. Your consultation is not active',
            ], 400);
        }

        $consultationDurationMinutes = (int) env("CONSULTATION_DURATION_MINUTES");

        $consultationEndTime = strtotime('+'.$consultationDurationMinutes.' minutes', strtotime($consultation->start_time));
        
        if (time() >= $consultationEndTime) {
            $consultation->status = 'closed';
            $consultation->save();
            return response()->json([
                'error' => 'Oops unable to send message. Your consultation has ended',
            ], 400);
        }

        $message = new Message;
        $message->consultation_id = $id;
        $message->user_id = $user->id;
        $message->type = $request->type;

        if($request->type === 'text') {
            $message->message = $request->message;
        }

        $message->save();

        return response()->json([
            'consultation' => $consultation,
            'message' => $message,
        ], 400);
    }

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
