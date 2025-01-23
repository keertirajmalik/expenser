package logger

import (
	"fmt"
	"log"
	"runtime"
	"strings"
	"time"
)

func (c *customLogger) Error(message string, v ...interface{}) {
	file, line := getCallerInfo(3)
	timestamp := time.Now().UTC().Format(time.RFC3339)

	var details map[string]interface{}
	if len(v) > 0 {
		if m, ok := v[0].(map[string]interface{}); ok {
			details = m
		}
	}

	stackTrace := GetStackTrace(3)
	logEntry := fmt.Sprintf("%s [ERROR] %s: %s | Caller: %s:%d\nStack Trace:\n%s",
		timestamp,
		message,
		formatDetails(details),
		file,
		line,
		stackTrace,
	)

	log.Println(logEntry)
}

func GetStackTrace(skip int) string {
	var stackTrace []string
	pc := make([]uintptr, 20)
	n := runtime.Callers(skip, pc)
	frames := runtime.CallersFrames(pc[:n])

	for i := 0; i < 10; i++ {
		frame, more := frames.Next()
		if !strings.Contains(frame.File, "expenser-server") {
			continue
		}

		stackEntry := fmt.Sprintf("%s:%d - %s",
			frame.File[strings.Index(frame.File, "expenser-server/"):],
			frame.Line,
			frame.Function,
		)
		stackTrace = append(stackTrace, stackEntry)

		if !more {
			break
		}
	}

	return strings.Join(stackTrace, "\n")
}

func formatDetails(details map[string]interface{}) string {
	if details == nil {
		return "{}"
	}

	var parts []string
	for k, v := range details {
		parts = append(parts, fmt.Sprintf("%s:%v", k, v))
	}

	return "{" + strings.Join(parts, " ") + "}"
}
