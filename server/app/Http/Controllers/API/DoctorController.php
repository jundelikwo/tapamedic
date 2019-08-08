<?php

namespace App\Http\Controllers\API;

use App\Doctor;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class DoctorController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $inputs = array_merge($request->input(), ['doctor' => $user->id]);

        $validator = Validator::make($inputs, [
          'doctor' => [
            'required',
            'exists:doctors,user_id'
          ],
          'graduation_year' => [
            'integer',
            'max:'.strftime("%Y", time()),
          ],
          'bank_name' => [
            'string',
          ],
          'account_name' => [
            'string',
          ],
          'account_number' => [
            'string',
          ],
          'mdcn_folio' => [
            'string',
          ],
          'mdcn_membership' => [
            'string',
          ],
          'specialty' => [
            'string',
          ],
          'university' => [
            'string',
          ],
          'location' => [
            'string',
          ],
        ]);

        if ($validator->fails()) {
            return response()->json([
              'error' => $validator->errors(),
            ], 400);
        }

        $doctor = Doctor::query()->where('user_id',$user->id)->first();

        if ($request->filled('bank_name')) {
            $doctor->bank_name = $request['bank_name'];
        }

        if ($request->filled('account_name')) {
            $doctor->account_name = $request['account_name'];
        }

        if ($request->filled('account_number')) {
            $doctor->account_number = $request['account_number'];
        }

        if ($request->filled('location')) {
            $doctor->location = $request['location'];
        }

        if($doctor->approved === 'no' && $doctor->review === 'no') {

            if ($request->filled('specialty')) {
                $doctor->specialty = $request['specialty'];
            }
            
            if ($request->filled('graduation_year')) {
                $doctor->graduation_year = $request['graduation_year'];
            }

            if ($request->filled('mdcn_folio')) {
                $doctor->mdcn_folio = $request['mdcn_folio'];
            }

            if ($request->filled('mdcn_membership')) {
                $doctor->mdcn_membership = $request['mdcn_membership'];
            }

            if ($request->filled('university')) {
                $doctor->university = $request['university'];
            }

            if (
                !empty($doctor->bank_name) &&
                !empty($doctor->account_name) &&
                !empty($doctor->account_number) &&
                !empty($doctor->location) &&
                !empty($doctor->specialty) &&
                !empty($doctor->graduation_year) &&
                !empty($doctor->mdcn_folio) &&
                !empty($doctor->mdcn_membership) &&
                !empty($doctor->university)
            ) {
                $doctor->review = 'yes';
            }
        }

        $doctor->save();

        return response()->json([
            'doctor' => $doctor,
            'user' => $user,
            'message' => 'Profile updated successfully.',
        ], 200);
    }
}
