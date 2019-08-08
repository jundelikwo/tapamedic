<?php

namespace App\Http\Controllers\API;

use App\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
use App\Http\Controllers\Controller;

class PatientController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $inputs = array_merge($request->input(), ['patient' => $user->id]);

        $validator = Validator::make($inputs, [
          'patient' => [
            'required',
            'exists:patients,id'
          ],
          'address' => [
            'string',
          ],
          'blood' => [
            Rule::in(['A', 'AB', 'B', 'O']),
          ],
          'date_of_birth' => [
            'string',
          ],
          'diseases' => [
            'string',
          ],
          'drugs' => [
            'string',
          ],
          'genotype' => [
            Rule::in(['AA', 'AS', 'SS']),
          ],
          'occupation' => [
            'string',
          ],
          'sex' => [
            Rule::in(['Male', 'Female']),
          ],
        ]);

        if ($validator->fails()) {
            return response()->json([
              'error' => $validator->errors(),
            ], 400);
        }

        $patient = Patient::find($user->id);
        
        if ($request->filled('address')) {
            $patient->address = $request['address'];
        }

        if ($request->filled('blood')) {
            $patient->blood = $request['blood'];
        }

        if ($request->filled('date_of_birth')) {
            $dob = strtotime($request['date_of_birth']);
            if($dob && $dob < time()) {
                $patient->date_of_birth = strftime("%Y-%m-%d %H:%M:%S", $dob);
            }
        }

        if ($request->filled('diseases')) {
            $patient->diseases = $request['diseases'];
        }

        if ($request->filled('drugs')) {
            $patient->drugs = $request['drugs'];
        }

        if ($request->filled('genotype')) {
            $patient->genotype = $request['genotype'];
        }

        if ($request->filled('occupation')) {
            $patient->occupation = $request['occupation'];
        }

        if ($request->filled('sex')) {
            $patient->sex = $request['sex'];
        }

        $patient->save();

        return response()->json([
            'patient' => $patient,
            'user' => $user,
            'message' => 'Profile updated successfully.',
        ], 200);
    }
}
