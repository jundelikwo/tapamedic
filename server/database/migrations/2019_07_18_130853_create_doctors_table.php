<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDoctorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->enum('approved', ['true', 'false'])->default('false');
            $table->enum('review', ['true', 'false'])->default('false');
            $table->unsignedInteger('graduation_year')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('mdcn_folio')->nullable();
            $table->string('mdcn_membership')->nullable();
            $table->string('specialty')->nullable();
            $table->string('university')->nullable();
            $table->string('location')->nullable();
            $table->unsignedBigInteger('total_earnings')->nullable();
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
        Schema::dropIfExists('doctors');
    }
}
