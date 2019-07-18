<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('consultation_id');
            $table->unsignedInteger('user_id');
            $table->enum('type', ['image', 'text'])->default('text');
            $table->text('message')->nullable();
            $table->string('image')->nullable();
            $table->string('thumb')->nullable();
            $table->timestamps();

            $table->foreign('consultation_id')
            ->references('id')
            ->on('consultations')
            ->onDelete('cascade');

            $table->foreign('user_id')
            ->references('id')
            ->on('users')
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
        Schema::dropIfExists('messages');
    }
}
