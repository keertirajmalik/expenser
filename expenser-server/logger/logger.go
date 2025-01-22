package logger

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"runtime"
	"strings"
)

type Logger struct {
	logger *slog.Logger
}

// Initialize the global logger
var globalLogger *Logger

func init() {
	// Set up a JSON handler for structured logging
	handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo, // Default log level
	})
	globalLogger = &Logger{
		logger: slog.New(handler),
	}
}

// Get the current caller information
func getCallerInfo(skip int) string {
	pc, file, line, ok := runtime.Caller(skip)
	if !ok {
		return "unknown"
	}
	funcName := runtime.FuncForPC(pc).Name()
	shortFile := file[strings.LastIndex(file, "/")+1:]
	return fmt.Sprintf("%s:%d - %s", shortFile, line, funcName)
}

// Get the complete stack trace
func getStackTrace(skip int) string {
	var sb strings.Builder
	pc := make([]uintptr, 10) // Adjust size for more frames if needed
	n := runtime.Callers(skip, pc)
	frames := runtime.CallersFrames(pc[:n])

	for {
		frame, more := frames.Next()
		sb.WriteString(fmt.Sprintf("%s:%d - %s\n", frame.File, frame.Line, frame.Function))
		if !more {
			break
		}
	}
	return sb.String()
}

// Convert []slog.Attr to []any for compatibility
func attrsToAny(attrs []slog.Attr) []any {
	anyFields := make([]any, len(attrs))
	for i, attr := range attrs {
		anyFields[i] = attr
	}
	return anyFields
}

// Log an info message
func Info(ctx context.Context, msg string, fields ...slog.Attr) {
	fields = append(fields, slog.String("caller", getCallerInfo(3)))
	globalLogger.logger.InfoContext(ctx, msg, attrsToAny(fields)...)
}

// Log an error message
func Error(ctx context.Context, msg string, err error, fields ...slog.Attr) {
	stackTrace := getStackTrace(4)
	fields = append(fields, slog.String("caller", getCallerInfo(3)))
	fields = append(fields, slog.String("stack_trace", stackTrace))
	fields = append(fields, slog.Any("error", err))

	globalLogger.logger.ErrorContext(ctx, msg, attrsToAny(fields)...)
}

// Log a debug message
func Debug(ctx context.Context, msg string, fields ...slog.Attr) {
	fields = append(fields, slog.String("caller", getCallerInfo(3)))
	globalLogger.logger.DebugContext(ctx, msg, attrsToAny(fields)...)
}

