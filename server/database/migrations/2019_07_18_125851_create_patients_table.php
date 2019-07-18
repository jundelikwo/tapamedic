<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePatientsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->text('address')->nullable();
            $table->enum('blood', ['A', 'AB', 'B', 'O'])->nullable();
            $table->text('diseases')->nullable();
            $table->timestamp('date_of_birth')->nullable();
            $table->text('drugs')->nullable();
            $table->enum('genotype', ['AA', 'AS', 'SS'])->nullable();
            $table->string('occupation')->nullable();
            $table->enum('sex', ['Male', 'Female'])->nullable();
            $table->unsignedBigInteger('wallet')->nullable();
            $table->timestamps();

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
        Schema::dropIfExists('patients');
    }
}
