<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {


        if($this->routeIs('auth.register')){
            $fields = [
                'username' => ['string', 'required'],
                'password' => ['string', 'required', Password::min(8)->mixedCase()->numbers()->symbols()],
                'email' => ['string', 'required'],
            ];
        }else if ($this->is('api/auth/forgot-password')) {
            $fields = [
                'email' => ['string', 'required'],
            ];
        }else {
            $fields = [
                'email' => ['string', 'required', 'exists:users'],
                'password' => ['string', 'required'],
            ];
        }

        return $fields;
    }

    public function messages()
    {
        return [
            'username.required' => 'The username field is required.',
            'password.required' => 'The password field is required.',
            'email.required' => 'The email field is required.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.mixedCase' => 'The password must contain at least one uppercase letter and one lowercase letter.',
            'password.numbers' => 'The password must contain at least one number.',
            'password.symbols' => 'The password must contain at least one special character.',
        ];
    }
}
