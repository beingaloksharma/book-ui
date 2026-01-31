import { Injectable } from '@angular/core';

export interface LogEntry {
    timestamp: Date;
    type: 'Request' | 'Response' | 'Error';
    url: string;
    method: string;
    status?: number;
    duration?: number;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private logs: LogEntry[] = [];

    addLog(entry: LogEntry) {
        this.logs.unshift(entry); // Add to beginning
        // Keep only last 100 logs
        if (this.logs.length > 100) {
            this.logs.pop();
        }
    }

    getLogs(): LogEntry[] {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }
}
