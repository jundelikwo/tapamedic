<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class UnApprovedDoctorOnly
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $isUnApproved = false;
        $doctor = Auth::user()->doctor;   
        if($doctor){
            $isUnApproved = $doctor->approved === 'no';
        }

        return Auth::user()['role'] == 'doctor' && $isUnApproved ? $next($request) : response()->json([
            'error' => 'Only unapproved doctors can access this resource',
        ], 400);
    }
}
