<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    public function register(Request $request){
        try{
            $email = $request->input("email");
            $password = $request->input("password");
            $username = $request->input("username");

            DB::transaction(function () use ($email, $password, $username) {
                User::create([
                    "email" => $email,
                    "password" => Hash::make($password),
                    "username" => $username
                ]);
            });
            DB::commit();
            return response()->json([
                "message" => "User created successfully",
                "success" => true,
            ],200);
        }catch(\Exception $e){
            return response()->
            json([
                "message" => $e->getMessage(),
                "success" => false,
            ],500);
        }

    }

    public function login(Request $request){
        try{
            $email = $request->input("email");
            $password = $request->input("password");

            $user = User::where("email", $email)->first();
            if(!$user){
                return response()->json([
                    "success" => false,
                    "message" => "User not found"
                ]);
            }
            if(Auth::attempt(["email" => $email, "password" => $password])){
                $user = Auth::user();
                $plainToken = $user->createToken("token")->plainTextToken;
                $encryptedToken =Crypt::encrypt($plainToken);

                return response()->json([
                    "success" => true,
                    "token" => $plainToken
                ]);
            }

        }catch(\Exception $e){
            return response()->
            json([
                "message" => $e->getMessage(),
                "success" => false,
            ],500);
        }


    }

    public function logout(){
        $user = Auth::user();
        if(!$user){
            return response()->json([
                "message" => "user not found"
            ],400);
        }
        $user->currentAccessToken()->delete();
    }
}
