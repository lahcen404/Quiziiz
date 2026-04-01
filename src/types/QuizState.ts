export interface QuizState{

    score: number;
    currentLevel: 1 | 2 | 3 ;
    timeLeft: number;
    isGameOver: boolean;
    status: 'loading' | 'playing' | 'error' | 'finishing';
}
