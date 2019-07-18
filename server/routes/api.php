<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v1'], function () {
	Route::post('login', 'API\UserController@login');
	Route::post('register', 'API\UserController@register');
	Route::post('/password/forgot', 'API\UserController@forgotPassword');

	Route::group(['middleware' => ['auth:api'], ], function () {
		Route::get('user', 'API\UserController@user');
		Route::get('logout', 'API\UserController@logout');

		Route::group(['middleware' => ['doctorOnly'], ], function () {

		});

		Route::group(['middleware' => ['patientOnly'], ], function () {
			Route::post('question', 'API\QuestionController@create');
		});
	});
});