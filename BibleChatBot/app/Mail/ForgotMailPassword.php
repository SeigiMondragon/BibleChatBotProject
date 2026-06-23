<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class ForgotMailPassword extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $user, $token, $baseUrl, $selector;

    public function __construct($user, $token, $selector)
    {
        $this->user = $user;
        $this->token = $token;
        $this->baseUrl = config("app.debug")
        ? "http://localhost:5173"
        : "https://biblechatbot.vercel.app";
        $this->selector = $selector;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Forgot Mail Password',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.forgotMail',
            with: [
                'user' => $this->user,
                'link' => "{$this->baseUrl}/reset-password/v={$this->selector}/t={$this->token}"
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
