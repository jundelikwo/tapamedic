<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('asker_id');
            $table->enum('answered', ['true', 'false'])->default('false');
            $table->unsignedInteger('num_answers')->default(0);
            $table->unsignedInteger('language_id');
            $table->text('question');
            $table->string('slug');
            $table->timestamps();

            $table->foreign('asker_id')
            ->references('id')
            ->on('users')
            ->onDelete('cascade');

            $table->foreign('language_id')
            ->references('id')
            ->on('languages')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('questions');
    }
}
