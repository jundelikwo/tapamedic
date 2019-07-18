<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class ApprovedDoctorOnly
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
        $isApproved = false;
        $doctor = Auth::user()->doctor;   
        if($doctor){
            $isApproved = $doctor->approved === 'true';
        }

        return Auth::user()['role'] == 'doctor' && $isApproved ? $next($request) : response()->json([
            'error' => 'Only approved doctors can access this resource',
        ], 400);
    }
}
