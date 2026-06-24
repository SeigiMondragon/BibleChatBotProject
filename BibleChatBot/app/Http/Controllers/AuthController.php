<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ForgotMailPassword;

class AuthController extends Controller
{
    public function register(UserRequest $request){
        try{
            $validated = $request->validated();
            $email = $validated["email"];
            $password = $validated["password"];
            $username = $validated["username"];

            if(User::where("email", $email)->exists()){
                return response()->json([
                    "success" => false,
                    "message" => "User already exists"
                ]);
            }

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

    public function login(UserRequest $request){
        try{
            $validated = $request->validated();
            $email = $validated["email"];
            $password = $validated["password"];

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

    public function sendForgotPassword(UserRequest $request){
        $fiveMinutes = now()->subMinutes(5)->toDateTimeString();
        $validated = $request->validated();
        $email = $validated["email"];
        $user = User::where("email", $email)->first();
        if(!$user){
            return response()->json([
                "success" => false,
                "message" => "User not found"
            ], 400);
        }


        try{
                $existingToken= DB::table('password_reset_tokens')->where('email', $email)->first();
                if($existingToken ){
                    $createdAt = \Carbon\Carbon::parse($existingToken->created_at);
                    if($createdAt->gt($fiveMinutes)){
                        return response()->json([
                            "success" => false,
                            "message" => "Password reset email were recently sent. Please Try again in 5 minutes"
                        ]);
                    }
                    DB::table('password_reset_tokens')->where('email', $email)->delete();
                }

                $resetToken = Str::random(60);
                $hashedToken = Hash::make($resetToken);
                $selector = Str::random(10);
                DB::transaction(function () use ($user, $hashedToken, $selector, $resetToken) {
                    DB::table("password_reset_tokens")->insert([
                        "email" => (string)$user->email,
                        "selector" => (string) $selector,
                        "token" => (string) $hashedToken,
                        "created_at" => now()
                    ]);
                    Mail::to($user->email)->send(new ForgotMailPassword($user, $resetToken, $selector));
                });
                return response()->json([
                    "success" => true,
                    "message" => "Password reset email sent"
                ]);

        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request){
        $isTokenValid = $this->validateToken($request->selector, $request->token);
        if (!$isTokenValid){
            return response()->json([
                "success" => false,
                "message" => "Token is invalid or expired"
            ], 400);
        }

        $validated = $request->validate([
            "password" => ["string", "required", Password::min(8)->mixedCase()->numbers()->symbols()]
        ]);
        $user = User::where("email", $isTokenValid->email)->first();
        $user->password = Hash::make($validated["password"]);
        $user->save();
        DB::table("password_reset_tokens")->where("selector", $request->selector)->delete();
        return response()->json([
            "success" => true,
            "message" => "Password reset successfully"
        ], 200);
    }

    public function validateToken( $selector, $plainToken){
        $tokenRecord = DB::table("password_reset_tokens")->where("selector", $selector)->first();
        if (!$tokenRecord){
            return false;
        }
        if (!Hash::check($plainToken, $tokenRecord->token)) {
        return false;
        }

        return $tokenRecord;
    }
}
