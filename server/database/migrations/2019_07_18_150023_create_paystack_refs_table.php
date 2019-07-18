<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePaystackRefsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('paystack_refs', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('consultation_id');
            $table->string('ref');
            $table->timestamps();

            $table->foreign('consultation_id')
            ->references('id')
            ->on('consultations')
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
        Schema::dropIfExists('paystack_refs');
    }
}
