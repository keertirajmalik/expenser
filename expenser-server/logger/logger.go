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
	file, line := getCallerInfo()
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

func getCallerInfo() (string, int) {
	for i := 1; i < 10; i++ { // Traverse up to 10 stack levels
		_, file, line, ok := runtime.Caller(i)
		if ok && strings.Contains(file, "your-repo-name") { // Replace with your repo name
			shortFile := file[strings.Index(file, "your-repo-name/"):]
			return shortFile, line
		}
	}
	return "unknown", 0
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
	logger.Println("ERROR", v...)
}

func Debug(v ...interface{}) {
	logger.Println("DEBUG", v...)
}
