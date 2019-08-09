<?php

namespace App\Http\Controllers\API;

use App\Doctor;
use Illuminate\Http\Request;
use Image;
use Validator;
use Storage;
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
            'nullable',
          ],
          'bank_name' => [
            'string',
            'nullable',
          ],
          'account_name' => [
            'string',
            'nullable',
          ],
          'account_number' => [
            'string',
            'nullable',
          ],
          'mdcn_folio' => [
            'string',
            'nullable',
          ],
          'mdcn_membership' => [
            'string',
            'nullable',
          ],
          'mdcn_photo' => [
            'mimes:jpeg,png,jpg,gif,bmp',
          ],
          'name' => [
            'string',
            'nullable',
          ],
          'profile' => [
            'mimes:jpeg,png,jpg,gif,bmp',
          ],
          'specialty' => [
            'string',
            'nullable',
          ],
          'university' => [
            'string',
            'nullable',
          ],
          'location' => [
            'string',
            'nullable',
          ],
        ]);

        if ($validator->fails()) {
          return response()->json([
            'error' => $validator->errors(),
          ], 400);
        }

        $doctor = $user->doctor;

        if (key_exists('bank_name', $inputs)) {
            $doctor->bank_name = $request['bank_name'];
        }

        if (key_exists('account_name', $inputs)) {
            $doctor->account_name = $request['account_name'];
        }

        if (key_exists('account_number', $inputs)) {
            $doctor->account_number = $request['account_number'];
        }

        if (key_exists('location', $inputs)) {
            $doctor->location = $request['location'];
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

        if($doctor->approved === 'no' && $doctor->review === 'no') {
          if (key_exists('specialty', $inputs)) {
            $doctor->specialty = $request['specialty'];
          }

          if (key_exists('name', $inputs)) {
            $user->name = $request['name'];
            $user->save();
          }

          if ($request->hasFile('mdcn_photo')) {
            Storage::deleteDirectory('mdcn_photo/'.$user->id);
            $mdcn_photo_path = $request->file('mdcn_photo')->store('mdcn_photo/'.$user->id.'/large');
            
            $img = Image::make(getcwd().'/../storage/app/'.$mdcn_photo_path);
            $img->fit(200, 200);
            $thumbnail_path = getcwd().'/../storage/app/'.'mdcn_photo/'.$user->id.'/thumb';
            $thumbnail_path .= substr($mdcn_photo_path, strripos($mdcn_photo_path, '/'));
            Storage::makeDirectory('mdcn_photo/'.$user->id.'/thumb/');
            $img->save($thumbnail_path);
          }
          
          if (key_exists('graduation_year', $inputs)) {
            $doctor->graduation_year = $request['graduation_year'];
          }

          if (key_exists('mdcn_folio', $inputs)) {
            $doctor->mdcn_folio = $request['mdcn_folio'];
          }

          if (key_exists('mdcn_membership', $inputs)) {
            $doctor->mdcn_membership = $request['mdcn_membership'];
          }

          if (key_exists('university', $inputs)) {
            $doctor->university = $request['university'];
          }

          if (
            !empty($user->name) &&
            !empty($doctor->bank_name) &&
            !empty($doctor->account_name) &&
            !empty($doctor->account_number) &&
            !empty($doctor->location) &&
            !empty($doctor->specialty) &&
            !empty($doctor->graduation_year) &&
            !empty($doctor->mdcn_folio) &&
            !empty($doctor->mdcn_membership) &&
            !empty($doctor->university) &&
            !empty(Storage::allFiles('mdcn_photo/'.$user->id)) &&
            !empty(Storage::allFiles('profile/'.$user->id))
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
