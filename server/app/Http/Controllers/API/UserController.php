<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Validator;
use Hash;
use App\Driver;
use App\User;

class UserController extends Controller
{
    public function login(Request $request)
    {
      // Attempt to login using web auth guard
      if (auth()->attempt(['email' => request('email'), 'password' => request('password')])) {
        // If it succeeds generate and return api token
        $user = auth()->user();
        $userId = $user->id;
        if($user->role !== 'admin'){
          $userTokens = $user->tokens;

          foreach($userTokens as $token) {
            $token->revoke();   
          }

          $res['user'] = $user;
          $res['driver'] = $user->driver;
          $res['token'] = $user->createToken('web-ui-api')->accessToken;

          return response()->json($res, 200);
        } else {
          return response()->json([
            'error' => strtoupper($user->role) . ' users must use the website',
          ], 400);
        }
      }

      return response()->json(['error' => 'Incorrect email and password'], 401);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->input(), [
          'name' => [
            'required',
            'string',
            'max:255',
          ],
          'role' => [
            'required',
            Rule::in(['driver', 'user'])
          ],
          'phone' => [
          	'required',
          ],
          'plate' => [
            'required_if:role,driver',
          ],
          'vin' => [
            'required_if:role,driver',
          ],
          'model' => [
            'required_if:role,driver',
          ],
          'email' => [
            'required',
            'email',
            'unique:users,email',
          ],
          'password' => [
            'required',
            'min:8',
            'string',
          ]
        ]);

        if ($validator->fails()) {
            return response()->json([
              'error' => $validator->errors(),
            ], 400);
        }

        $input = [
          'name' => $request['name'],
          'email' => $request['email'],
          'phone' => $request['phone'],
          'role' => $request['role'],
          'password' => bcrypt($request['password']),
        ];

        $user = User::create($input);

        if($user->role === 'driver'){
          $res['driver'] = Driver::create([
            'user_id' => $user->id,
            'current_earnings' => 0,
            'total_earnings' => 0,
            'plate' => $request['plate'],
            'vin' => $request['vin'],
            'model' => $request['model'],
            'status' => 'active'
          ]);
        }

        $res['user'] = $user;
        $res['token'] = $user->createToken('web-ui-api')->accessToken;

        return response()->json($res, 200);
    }

    public function logout(Request $request)
    {
        if (\array_key_exists('reset-all', $request->all()) &&
            $request->all()['reset-all'] == 'true') {
            $this->logoutAll();

            return response()->json([
                'message' => 'Tokens deleted successfully.',
            ], 200);
        }

        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->input(), [
          'name' => [
            'required',
            'string',
            'max:255',
          ],
          'phone' => [
            'required',
          ]
        ]);

        if ($validator->fails()) {
            return response()->json([
              'error' => $validator->errors(),
            ], 400);
        }

        $user = $request->user();
        $user->name = $request['name'];
        $user->phone = $request['phone'];
        $user->save();

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully.',
        ], 200);
    }

    public function updateLocation(Request $request)
    {
        $validator = Validator::make($request->input(), [
          'lat' => [
            'required',
            'numeric',
            'between:-90,90'
          ],
          'lng' => [
            'required',
            'numeric',
            'between:-180,180'
          ]
        ]);

        if ($validator->fails()) {
            return response()->json([
              'error' => $validator->errors(),
            ], 400);
        }

        $user = $request->user();
        $user->lat = $request['lat'];
        $user->lng = $request['lng'];
        $user->save();

        if($user->driver){
          $user->driver->lat = $request['lat'];
          $user->driver->lng = $request['lng'];
          $user->driver->save();
        }

        return response()->json([
            'user' => $user,
        ], 200);
    }

    public function forgotPassword(Request $request){
        $validator = Validator::make($request->input(), [
          'email' => [
            'required',
            'email',
            'exists:users,email',
          ]
        ]);

        $user = User::where('email', '=', $_POST['email']??'')->first();

        if (empty($user)) {
            return response()->json([
              'error' => 'Your email does not exist in our database',
            ], 400);
        }

        $password = $this->genPassword(8);
        // SEND EMAIL CONTAINING PASSWORD

        $user->password = Hash::make($password);
        $user->save();

        return response()->json([
            'message' => "An email has been sent containing your new password"
        ]);
    }

    private function genPassword(int $length, string $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): ?string
    {
        $pieces = [];
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; ++$i) {
            $pieces []= $keyspace[random_int(0, $max)];
        }
        return implode('', $pieces);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->input(), [
            'current-password' => [
                'required',
            ],
            'new-password' => [
                'required',
                'min:8',
                'string',
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors(),
            ], 400);
        }

        $user = $request->user();

        if (!Hash::check($request['current-password'], $user->getAuthPassword())) {
            return response()->json([
                'error' => [
                    'The current password is incorrect.',
                ],
            ], 400);
        }

        $user->password = Hash::make($request->input('new-password'));
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully',
        ], 200);
    }

    public function user(Request $request)
    {
      $user = $request->user();
      $res['user'] = $user;
      $res['driver'] = Driver::query()->where('user_id',$user->id)->first();

      return response()->json($res, 200);
    }
}
