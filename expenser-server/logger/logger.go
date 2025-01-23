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
	timestamp := time.Now().UTC().Format(time.RFC3339)
	message := fmt.Sprintf("%v", v[0])

	if file == "unknown" {
		log.Printf("%s [%s] %s", timestamp, level, message)
		return
	}
	log.Printf("%s [%s] %s | Caller: %s:%d", timestamp, level, message, file, line)
}

func getCallerInfo(skip int) (string, int) {
	for i := skip; i < skip+10; i++ {
		_, file, line, ok := runtime.Caller(i)
		if ok && strings.Contains(file, "expenser-server") && !strings.Contains(file, "logging") {
			shortFile := file[strings.Index(file, "expenser-server/"):]
			return shortFile, line
		}
	}
	return "unknown", 0
}

var logger = customLogger{}

func init() {
	log.SetFlags(0)
}

func Info(message string) {
	logger.Println("INFO", message)
}

func Warn(message string) {
	logger.Println("WARN", message)
}

func Error(message string, details map[string]interface{}) {
	logger.Error(message, details)
}

func Debug(message string) {
	logger.Println("DEBUG", message)
}

