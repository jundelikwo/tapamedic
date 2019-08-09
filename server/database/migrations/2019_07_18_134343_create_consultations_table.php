<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateConsultationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('patient_id');
            $table->unsignedInteger('doctor_id');
            $table->enum('status', ['accepted', 'closed', 'pending'])->default('pending');
            $table->timestamp('start_time')->nullable();
            $table->enum('media', ['audio', 'text', 'video'])->default('text');
            $table->string('opentok_session')->nullable();
            $table->string('opentok_token')->nullable();
            $table->timestamps();

            $table->foreign('patient_id')
            ->references('id')
            ->on('users')
            ->onDelete('cascade');

            $table->foreign('doctor_id')
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
        Schema::dropIfExists('consultations');
    }
}
