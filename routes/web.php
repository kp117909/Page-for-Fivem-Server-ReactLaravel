<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\BanListController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\Auth\DiscordAuthController;
use App\Http\Controllers\BanHistoryListController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Auth;

Auth::routes(['register' => false, 'reset' => false]);

Route::get('/home', [MainController::class, 'login'])->name('home');

Route::post('/auth/discord', [DiscordAuthController::class, 'redirectToDiscord'])->name('auth.discord.redirect');
Route::get('/auth/discord/callback', [DiscordAuthController::class, 'handleDiscordCallback']);


Route::group(['middleware' => 'auth'], function () {

    Route::get('/', [MainController::class, 'index'])->name('index');

    Route::group(['prefix' => '/user', 'as' => 'user.'], function () {
        Route::get('/', [UserController::class, 'list']);
        Route::get('/auth', [UserController::class, 'get']);
        // Route::post('/', [BanListController::class, 'store']);
        // Route::delete('/{identifier}', [BanListController::class, 'delete']);
    });


    Route::group(['prefix' => '/ban', 'as' => 'ban.'], function () {
        Route::get('/', [BanListController::class, 'list']);
        Route::get('/{identifier}', [BanListController::class, 'get']);
        Route::post('/', [BanListController::class, 'store']);
        Route::delete('/{identifier}', [BanListController::class, 'delete']);
    });

    Route::group(['prefix' => '/banHistory', 'as' => 'banHistory.'], function () {
        Route::get('/', [BanHistoryListController::class, 'list']);
        Route::get('/{identifier}', [BanListController::class, 'get']);
    });


    Route::group(['prefix' => '/player', 'as' => 'player.'], function () {
        Route::get('/', [PlayerController::class, 'list']);
        Route::get('/{identifier}', [PlayerController::class, 'get']);
        Route::post('/', [PlayerController::class, 'store']);
        Route::get('/deleteCharacter/{identifier}', [PlayerController::class, 'getDeleteCharacter']);
    });

    Route::group(['prefix' => '/vehicle', 'as' => 'vehicle.'], function () {
        Route::get('/{identifier}', [VehicleController::class, 'getPlayerVehicles']);
        Route::post('/', [VehicleController::class, 'store']);
        Route::get('/delete/{plate}', [VehicleController::class, 'getdeleteVehicle']);
    });

    Route::group(['prefix' => '/inventory', 'as' => 'inventory.'], function () {
        Route::post('/', [InventoryController::class, 'store']);
    });

});
