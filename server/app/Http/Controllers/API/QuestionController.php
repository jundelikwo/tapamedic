<?php

namespace App\Http\Controllers\API;

use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class QuestionController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $validator = Validator::make($request->input(), [
            'question' => [
                'required',
                'string',
            ],
            'language' => [
                'required',
                'exists:languages,id'
            ],
        ]);
  
        if ($validator->fails()) {
            return response()->json([
            'error' => $validator->errors(),
            ], 400);
        }

        $question = Question::create([
            'question' => $request['question'],
            'language_id' => $request['language'],
            'asker_id' => $user->id,
            'answered' => 'no',
            'num_answers' => 0,
            'slug' => str_slug($request['question']),
        ]);
        $question['slug'] .= '-' . $question->id;
        $question->save();

        return response()->json([
            'question' => $question,
            'user' => $user
        ], 200); 
    }

    public function list(Request $request)
    {
        $size = 30;
        $page = !empty($request->input('page')) ? $request->input('page') : 1;

        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $query = Question::query();

        if($user->role !== 'doctor'){
            $query->where('answered', 'yes');
        }

        $paginator = $query->paginate($size);
        $paginator->currentPage($page);

        return response()->json([
            'user' => $user,
            'questions' => $paginator
        ], 200); 
    }
}
