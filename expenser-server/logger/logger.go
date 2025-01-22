package logger

import (
	"fmt"
	"log"
	"runtime"
	"strings"
	"time"
)

type customLogger struct{}

func (c customLogger) Println(level string, v ...interface{}) {
	file, line := getCallerInfo(3)
	timestamp := time.Now().UTC().Format(time.RFC3339) // ISO 8601 timestamp

	if file == "unknown" {
		log.Printf("%s [%s] %s", timestamp, level,
			fmt.Sprintf(v[0].(string), v[1:]...)) // Format the message correctly with the arguments
		return
	}

	message := fmt.Sprintf("%s [%s] %s | Caller: %s:%d",
		time.Now().UTC().Format(time.RFC3339),
		level,
		fmt.Sprintf(v[0].(string), v[1:]...), // Format the message correctly with the arguments
		file,
		line,
	)
	log.Println(message)
}
func (c *customLogger) Error(format string, v ...interface{}) {
	file, line := getCallerInfo(0) // Adjust skip value
	timestamp := time.Now().UTC().Format(time.RFC3339)
	message := fmt.Sprintf(v[0].(string), v[1:]...)

	// Include stack trace for errors
	stackTrace := GetStackTrace(4) // Start 4 levels up to skip logger frames

	if file == "unknown" {
		log.Printf("%s [ERROR] %s\nStack Trace:\n%s", timestamp, message, stackTrace)
	} else {
		log.Printf("%s [ERROR] %s | Caller: %s:%d\nStack Trace:\n%s", timestamp, message, file, line, stackTrace)
	}
}

func getCallerInfo(skip int) (string, int) {
	for i := skip; i < skip+10; i++ { // Traverse up to 10 stack levels starting at `skip`
		_, file, line, ok := runtime.Caller(i)
		if ok && strings.Contains(file, "expenser-server") {
			shortFile := file[strings.Index(file, "expenser-server/"):]
			return shortFile, line
		}
	}
	return "unknown", 0
}

func GetStackTrace(skip int) string {
	var sb strings.Builder
	pc := make([]uintptr, 10) // Adjust size for more stack frames if needed
	n := runtime.Callers(skip, pc)
	frames := runtime.CallersFrames(pc[:n])

	for {
		frame, more := frames.Next()
		// Format each frame
		sb.WriteString(fmt.Sprintf("%s:%d - %s\n", frame.File, frame.Line, frame.Function))
		if !more {
			break
		}
	}

	return sb.String()
}

var logger = customLogger{}

func init() {
	// Disable default timestamps from log package
	log.SetFlags(0)
}

func Info(v ...interface{}) {
	logger.Println("INFO", v...)
}

func Error(v ...interface{}) {
	logger.Error("ERROR", v...)
}

func Debug(v ...interface{}) {
	logger.Println("DEBUG", v...)
}
