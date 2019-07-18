<?php

namespace App\Http\Controllers\API;

use App\Answer;
use App\Question;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;

class AnswerController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $validator = Validator::make($request->input(), [
            'answer' => [
                'required',
                'string',
            ],
            'question' => [
                'required',
                'exists:questions,id'
            ],
        ]);
  
        if ($validator->fails()) {
            return response()->json([
            'error' => $validator->errors(),
            ], 400);
        }

        $question = Question::find($request['question']);

        $answer = Answer::query()->where('question_id', $request['question'])
            ->where('doctor_id', $user->id)->first();

        if($answer){
            $answer['answer'] = $request['answer'];
            $answer->save();
        } else {
            $question['answered'] = 'yes';
            $question['num_answers'] += 1;
            $question->save();

            $answer = Answer::create([
                'answer' => $request['answer'],
                'question_id' => $request['question'],
                'doctor_id' => $user->id,
            ]);
        }

        return response()->json([
            'answer' => $answer,
            'question' => $question,
            'user' => $user
        ], 200);
    }

    public function list(Request $request, $id)
    {
        $size = 10;
        $page = !empty($request->input('page')) ? $request->input('page') : 1;

        $user = $request->user();
        $user['last_seen'] = strftime("%Y-%m-%d %H:%M:%S", time());
        $user['status'] = 'online';
        $user->save();

        $query = Answer::query()->where('question_id', $id)
            ->where('doctor_id', '!=',$user->id);

        $paginator = $query->paginate($size);
        $paginator->currentPage($page);

        $myAnswer = null;
        
        if($user->role === 'doctor' && $page == 1){
            $myAnswer = Answer::query()->where('question_id', $id)
                ->where('doctor_id',$user->id)->first();
        }

        return response()->json([
            'user' => $user,
            'answers' => $paginator,
            'my_answer' => $myAnswer,
        ], 200); 
    }
}
