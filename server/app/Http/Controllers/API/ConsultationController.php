<?php

namespace App\Http\Controllers\API;

use App\Consultation;
use App\ConsultationPayment;
use App\Doctor;
use App\Patient;
use App\User;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class ConsultationController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $inputs = array_merge($request->input(), ['patient' => $user->id]);

        $validator = Validator::make($inputs, [
            'doctor' => [
                'required',
                'exists:doctors,user_id'
            ],
            'patient' => [
                'required',
                'exists:patients,user_id'
            ],
        ]);
  
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 400);
        }

        $patient = $user->patient;
        $doctor = User::find($request->doctor);

        $ConsultationFee = (int) env("CONSULTATION_FEE");
        
        if($patient->wallet < $ConsultationFee){
            return response()->json([
                'error' => 'Oops you have insufficient funds in your wallet',
            ], 400);
        }

        if($request->doctor == $user->id){
            return response()->json([
                'error' => 'Oops you can not be both the doctor & patient of the same consultation',
            ], 400);
        }

        if($doctor->status !== 'online'){
            return response()->json([
                'error' => 'Oops the doctor you requested is offline. Please select another doctor',
            ], 400);
        }

        if($doctor->doctor->approved !== 'yes'){
            return response()->json([
                'error' => 'Oops the doctor you requested has not been approved. Please select another doctor',
            ], 400);
        }

        if(!empty(Consultation::query()->where('patient_id', $user->id)
            ->where('status', '!=', 'closed')->count()))
        {
            return response()->json([
                'error' => 'Oops you have an active or pending consultation, close or cancel it to continue',
            ], 400);
        }

        $consultation = Consultation::create([
            'patient_id' => $user->id,
            'doctor_id' => $request->doctor,
            'status' => 'pending',
            'media' => 'text',
        ]);

        return response()->json([
            'consultation' => $consultation,
            'message' => 'Consultation initiation successful, waiting for the doctor to accept.',
        ], 200);
    }

    public function cancel(Request $request, $id)
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

        if ($consultation->patient_id !== $user->id) {
            return response()->json([
                'error' => 'Oops you can only cancel your own consultation',
            ], 400);
        }

        if ($consultation->status !== 'pending') {
            return response()->json([
                'error' => 'Oops can not cancel the selected consultation',
            ], 400);
        }

        $consultation->delete();

        return response()->json([
            'message' => 'Consultation closed successfully.',
        ], 400);
    }

    public function reject(Request $request, $id)
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

        if ($consultation->doctor_id !== $user->id) {
            return response()->json([
                'error' => 'Oops could not cancel this consultation',
            ], 400);
        }

        if ($consultation->status !== 'pending') {
            return response()->json([
                'error' => 'Oops can not cancel the selected consultation',
            ], 400);
        }

        $consultation->delete();

        return response()->json([
            'message' => 'Consultation closed successfully.',
        ], 400);
    }

    public function accept(Request $request, $id)
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

        if ($consultation->doctor_id !== $user->id) {
            return response()->json([
                'error' => 'Oops could not accept this consultation',
            ], 400);
        }

        if ($consultation->status !== 'pending') {
            return response()->json([
                'error' => 'Oops can not accept the selected consultation',
            ], 400);
        }

        $patient = Patient::query()->where('user_id', $consultation->patient_id)->first();

        if (empty($patient)) {
            return response()->json([
                'error' => 'Oops can not accept the selected consultation, the patient is unavialable',
            ], 400);
        }

        $ConsultationFee = (int) env("CONSULTATION_FEE");

        if ($patient->wallet < $ConsultationFee) {
            return response()->json([
                'error' => 'Oops can not accept the selected consultation, the patient has insufficient funds',
            ], 400);
        }

        $patient->wallet -= $ConsultationFee;
        $patient->save();

        $doctorCut = (int) env("DOCTOR_CONSULTATION_CUT");
        $tapamedicCut = (int) env("TAPAMEDIC_CONSULTATION_CUT");

        $doctor = $user->doctor;
        $doctor->wallet += $doctorCut;
        $doctor->total_earnings += $doctorCut;
        $doctor->save();

        $consultation->status = 'accepted';
        $consultation->start_time = strftime("%Y-%m-%d %H:%M:%S", time());
        $consultation->save();

        ConsultationPayment::create([
            'consultation_id' => $consultation->id,
            'year' => strftime("%Y", time()),
            'month' => strftime("%m", time()),
            'day' => strftime("%d", time()),
            'doctor_cut' => $doctorCut,
            'tapamedic_cut' => $tapamedicCut,
        ]);

        return response()->json([
            'message' => 'Consultation accepted successfully.',
            'consultation' => $consultation,
            'doctor' => $doctor,
        ], 400);
    }
}
