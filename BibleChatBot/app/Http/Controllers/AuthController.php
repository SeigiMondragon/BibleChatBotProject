<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Resources\UserResource;

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

            if(!User::where("email", $email)->exists()){
                return response()->json([
                    "success" => false,
                    "message" => "User not found"
                ]);
            }
            if($token = auth()->attempt(["email" => $email, "password" => $password])){
                return $this->respondWithToken($token);
            }

            return response()->json([
                "success" => false,
                "message" => "Invalid credentials"
            ], 401);

        }catch(\Exception $e){
            return response()->
            json([
                "message" => $e->getMessage(),
                "success" => false,
            ],500);
        }


    }


    public function logout(){
        auth()->logout();

        return response()->json([
            "success" => true,
            "message" => "Successfully logged out"
        ]);
    }

    public function getMe() {
        return response()->json([
            "success" => true,
            "user" => auth()->user()
        ]);
    }

    public function refresh() {
        return $this->respondWithToken(auth()->refresh());
    }

    protected function respondWithToken($token){
        $cookie = cookie("token", $token, auth()->factory()->getTTL() * 60, "/", null, true, true,false,'Strict');

        return response()->json([
            "success" => true,
        ],200)->withCookie($cookie);
    }
}
