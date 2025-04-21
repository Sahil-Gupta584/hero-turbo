'use client';

import { Button } from "@heroui/react";
// import { PrismaClient } from "@prisma/client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

// const prisma = new PrismaClient();

export default function RoleSelection() {
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleSignup = async (role: 'editor' | 'viewer') => {
        setIsLoading(true);
        try {
            // First, sign in with Google
            const result = await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: false
            });

            if (result?.error) {
                console.error('Google Sign In Error:', result.error);
                setIsLoading(false);
                return;
            }

            // If sign in is successful, update user role in database
            const response = await fetch('/api/auth/update-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role })
            });

            if (!response.ok) {
                throw new Error('Failed to update user role');
            }

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Signup Error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4 items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Choose Your Role</h1>
            <Button
                onPress={() => handleRoleSignup('viewer')}
                isLoading={isLoading}
                color="secondary"
            >
                Continue as Content Creator
            </Button>
            <Button
                onPress={() => handleRoleSignup('editor')}
                isLoading={isLoading}
                color="primary"
            >
                Continue as Editor
            </Button>
           
        </div>
    );
}