package handler

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"

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
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			logger.Error("Error while reading the file content", map[string]interface{}{
				"error":    err,
				"filename": handler.Filename,
			})
		}
		// write this byte array to our temporary file
		tempFile.Write(fileBytes)

		// return that we have successfully uploaded our file!
		respondWithJson(w, http.StatusCreated, "Successfully Uploaded Filen")
	}
}
