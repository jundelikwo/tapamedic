<?php

namespace App\Http\Controllers\API;

use App\Patient;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Image;
use Storage;
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
            'exists:patients,user_id'
          ],
          'address' => [
            'string',
            'nullable',
          ],
          'blood' => [
            Rule::in(['A', 'AB', 'B', 'O']),
            'nullable',
          ],
          'date_of_birth' => [
            'string',
            'nullable',
          ],
          'diseases' => [
            'string',
            'nullable',
          ],
          'drugs' => [
            'string',
            'nullable',
          ],
          'genotype' => [
            Rule::in(['AA', 'AS', 'SS']),
            'nullable',
          ],
          'name' => [
            'string',
            'nullable',
          ],
          'occupation' => [
            'string',
            'nullable',
          ],
          'profile' => [
            'mimes:jpeg,png,jpg,gif,bmp',
          ],
          'sex' => [
            Rule::in(['Male', 'Female']),
            'nullable',
          ],
        ]);

        if ($validator->fails()) {
          return response()->json([
            'error' => $validator->errors(),
          ], 400);
        }

        if (key_exists('name',$inputs)) {
          $user->name = $request['name'];
          $user->save();
        }

        if ($request->hasFile('profile')) {
          Storage::deleteDirectory('profile/'.$user->id);
          $profile_path = $request->file('profile')->store('profile/'.$user->id.'/large');
          
          $img = Image::make(getcwd().'/../storage/app/'.$profile_path);
          $img->fit(200, 200);
          $thumbnail_path = getcwd().'/../storage/app/'.'profile/'.$user->id.'/thumb';
          $thumbnail_path .= substr($profile_path, strripos($profile_path, '/'));
          Storage::makeDirectory('profile/'.$user->id.'/thumb/');
          $img->save($thumbnail_path);
        }

        $patient = $user->patient;
        
        if (key_exists('address', $inputs)) {
            $patient->address = $request['address'];
        }

        if (key_exists('blood', $inputs)) {
            $patient->blood = $request['blood'];
        }

        if (key_exists('date_of_birth', $inputs)) {
            $dob = strtotime($request['date_of_birth']);
            if($dob && $dob < time()) {
                $patient->date_of_birth = strftime("%Y-%m-%d %H:%M:%S", $dob);
            }
        }

        if (key_exists('diseases', $inputs)) {
            $patient->diseases = $request['diseases'];
        }

        if (key_exists('drugs', $inputs)) {
            $patient->drugs = $request['drugs'];
        }

        if (key_exists('genotype', $inputs)) {
            $patient->genotype = $request['genotype'];
        }

        if (key_exists('occupation', $inputs)) {
            $patient->occupation = $request['occupation'];
        }

        if (key_exists('sex', $inputs)) {
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
