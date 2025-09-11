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
			logger.Error("Error while reciving file", map[string]interface{}{
				"error": err,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		if strings.HasSuffix(handler.Filename, ".xls") {
			logger.Error("invalid file is uploaded", map[string]interface{}{
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusBadRequest, "Only XLSX file is allowed")
			return
		} else if !strings.HasSuffix(handler.Filename, ".xlsx") {
			logger.Error("invalid file is uploaded", map[string]interface{}{
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusBadRequest, "Only XLSX file is allowed")
			return
		}

		currentDir, _ := filepath.Abs("./")
		tempDir := currentDir + "/temp-files"
		tempFile, err := os.CreateTemp(tempDir, "*-"+handler.Filename)
		if err != nil {
			logger.Error("Error while creaing temp file", map[string]interface{}{
				"error":    err,
				"filename": handler.Filename,
			})
		}
		defer tempFile.Close()

		// read all of the contents of our uploaded file into a byte array
		fileBytes, err := io.ReadAll(file)
		if err != nil {
			logger.Error("Error while reading the file content", map[string]interface{}{
				"error":    err,
				"filename": handler.Filename,
			})
		}
		// write this byte array to our temporary file
		tempFile.Write(fileBytes)

		// parse the excel file uploaded and display the data
		transactions, err := util.ReadExcelFile(tempFile.Name())
		if err != nil {
			logger.Error("Error while parsing the file content", map[string]interface{}{
				"error":    err,
				"filename": handler.Filename,
			})
			respondWithError(w, http.StatusBadRequest, err.Error())
		}
		// pick and convert it to json object with name, date, amout, credit/debit

		// return that we have successfully uploaded our file!
		respondWithJson(w, http.StatusCreated, transactions)
	}
}
