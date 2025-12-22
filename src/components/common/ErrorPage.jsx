import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ErrorPage() {
    const [error] = React.useState({
        code: '500',
        title: 'Internal Server Error',
        message: '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date().toLocaleString('ko-KR')
    });

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <div>
                        <CardTitle className="text-4xl font-bold text-gray-900">
                            {error.code}
                        </CardTitle>
                        <CardDescription className="text-xl mt-2">
                            {error.title}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>오류 발생</AlertTitle>
                        <AlertDescription>
                            {error.message}
                        </AlertDescription>
                    </Alert>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700">발생 시간</p>
                        <p className="text-sm text-gray-600">{error.timestamp}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>도움이 필요하신가요?</strong><br />
                            문제가 지속되면 고객 지원팀에 문의해주세요.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-3 justify-center">
                    <Button onClick={handleRefresh} variant="outline" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        다시 시도
                    </Button>
                    <Button onClick={handleGoHome} className="gap-2">
                        <Home className="w-4 h-4" />
                        홈으로 이동
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}