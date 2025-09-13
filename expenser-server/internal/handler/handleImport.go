package handler

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/keertirajmalik/expenser/expenser-server/internal/handler/util"
	"github.com/keertirajmalik/expenser/expenser-server/logger"
)

func HandleTransactionImport() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		file, handler, err := r.FormFile("file")

		if err != nil {
			logger.Error("Error while receiving file", map[string]any{
				"error": err,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		defer func() {
			if cerr := file.Close(); cerr != nil {
				logger.Error("failed to close temp file", map[string]any{"error": cerr, "name": handler.Filename})
			}
		}()

		ext := strings.ToLower(filepath.Ext(handler.Filename))
		if ext == ".xls" {
			logger.Error("invalid file is uploaded", map[string]any{
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusBadRequest, "Only XLSX file is allowed")
			return
		} else if ext != ".xlsx" {
			logger.Error("invalid file is uploaded", map[string]any{
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusBadRequest, "Only XLSX file is allowed")
			return
		}

		currentDir, _ := filepath.Abs("./")
		tempDir := currentDir + "/temp-files"
		if err := os.MkdirAll(tempDir, 0o700); err != nil {
			logger.Error("failed to ensure temp dir", map[string]any{"error": err, "dir": tempDir})
			respondWithError(w, http.StatusInternalServerError, "Server error")
			return
		}
		tempFile, err := os.CreateTemp(tempDir, "*-"+handler.Filename)
		if err != nil {
			logger.Error("Error while creating temp file", map[string]any{
				"error":    err,
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusInternalServerError, "Server error")
			return
		}
		defer func() {
			if cerr := tempFile.Close(); cerr != nil {
				logger.Error("failed to close temp file", map[string]any{"error": cerr, "name": tempFile.Name()})
			}
			if rerr := os.Remove(tempFile.Name()); rerr != nil {
				logger.Error("failed to remove temp file", map[string]any{"error": rerr, "name": tempFile.Name()})
			}
		}()

		// read all of the contents of our uploaded file into a byte array
		if _, err := io.Copy(tempFile, file); err != nil {
			logger.Error("Error while persisting uploaded file", map[string]any{
				"error":    err,
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusInternalServerError, "Server error")
			return
		}

		// parse the excel file uploaded and display the data
		transactions, err := util.ReadExcelFile(tempFile.Name())
		if err != nil {
			logger.Error("Error while parsing the file content", map[string]any{
				"error":    err,
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		respondWithJson(w, http.StatusCreated, transactions)
	}
}
