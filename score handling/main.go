package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
	uuid "github.com/satori/go.uuid"
)

func main() {
	creatdb()
	// insertData()
	// return
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html") // Serve the HTML file
	})
	http.HandleFunc("/ask", doesCookie)
	http.HandleFunc("/sendData", newscore)      //post
	http.HandleFunc("/getmescores", sendScores) //get

	http.Handle("/gifs/", http.StripPrefix("/gifs/", http.FileServer(http.Dir("gifs"))))
	http.Handle("/sound/", http.StripPrefix("/sound/", http.FileServer(http.Dir("sound"))))
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	log.Println("Server started at http://localhost:184")
	http.ListenAndServe(":184", nil)
}

// func home(w http.ResponseWriter, r *http.Request) {
// 	templ, err := template.ParseFiles("./index.html")
// 	if err != nil {
// 		log.Println(err)
// 		http.Error(w, "Internal Server Error", 500)
// 		return
// 	}
// 	err = templ.Execute(w, nil)
// 	if err != nil {
// 		log.Println(err)
// 		http.Error(w, "Internal Server Error", 500)
// 		return
// 	}
// }

type Score struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
	Rank  int    `json:"rank"`
}

func sendScores(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	db := OpenDB()
	defer db.Close()
	query := "SELECT name , score, time , rank FROM scores ORDER BY rank ASC;"
	rows, err := db.Query(query)
	if err != nil {
		log.Println("oopsie cannot get", err)
	}
	defer rows.Close()
	var scores []Score

	for rows.Next() {
		var score Score
		if err := rows.Scan(&score.Name, &score.Score, &score.Time, &score.Rank); err != nil {
			http.Error(w, "Failed to scan data", http.StatusInternalServerError)
			log.Println("Scan error:", err)
			return
		}
		scores = append(scores, score)
	}

	jsonData, err := json.Marshal(scores)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Println("JSON encode error:", err)
		return
	}

	// Write JSON response
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func doesCookie(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("gameSession")
	// doesExist := true
	uuser := User{}
	if err == nil { //cookie found
		// db := OpenDB()
		// defer db.Close()
		// err := db.QueryRow("SELECT id FROM scores WHERE sessionID=?;", c.Value)
		// if err != nil {
		// 	doesExist = false
		// }
		uuser = GetCurrentUser(w, r, c)
		fmt.Println(uuser.Name)
	}
	if err != nil || uuser.Name == "geust" { //or sessionid not found in db
		log.Println("no cookie found for current user")
		sessionID := uuid.NewV4()
		// doesExist = true
		http.SetCookie(w, &http.Cookie{
			Name:   "gameSession",
			Value:  sessionID.String(),
			MaxAge: 30 * 1440, //// Cookie valid for 30 days
		})
		fmt.Println("cookie is set")
		db := OpenDB()
		defer db.Close()
		query := "INSERT INTO scores (sessionID , name, score, rank, time) VALUES (?, ?, ?, ?, ?)"
		_, err := db.Exec(query, sessionID.String(), "geust", 0, 0, 0.0)
		if err != nil {
			log.Println("error inserting new session\n", err)
			return
		} else {
			fmt.Println("Session inserted successfully")
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]")) // Return an empty array if no comments are found

		return
	}
	loggedUser := GetCurrentUser(w, r, c)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "user found",
		"name":    loggedUser.Name,
	})
}

func newscore(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var nowdata User
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&nowdata) //name and score
	if err != nil {
		log.Println(err, "error in converting post from json to data struct")
		return
	}
	log.Printf("Decoded Post: %+v\n", nowdata)

	c, err := r.Cookie("gameSession")
	if err != nil {
		log.Println(err)
		return
	}
	nowdata.SessionId = c.Value
	loggedUser := GetCurrentUser(w, r, c)
	db := OpenDB()
	defer db.Close()
	err = db.QueryRow("SELECT id, name, score, time, rank FROM scores WHERE sessionID=?;", c.Value).Scan(&loggedUser.Id, &loggedUser.Name, &loggedUser.Score, &loggedUser.Time, &loggedUser.Rank)
	if err != nil {
		log.Println(err)
	}

	newscore := loggedUser.Score + nowdata.Score
	newtime := loggedUser.Time + 0.5
	fmt.Println("old data: ", loggedUser)
	if loggedUser.Name == "geust" {

		_, err = db.Exec("UPDATE scores SET name = ? WHERE id = ?", nowdata.Name, loggedUser.Id)
		if err != nil {
			log.Println("Error updating name:", err)
			return
		}
	}
	_, err = db.Exec("UPDATE scores SET score = ? WHERE id = ?", newscore, loggedUser.Id)
	if err != nil {
		log.Println("Error updating score:", err)
	}
	_, err = db.Exec("UPDATE scores SET time = ? WHERE id = ?", newtime, loggedUser.Id)
	if err != nil {
		log.Println("Error updating time:", err)
	}
	updateRanks()
	fmt.Println("new updated data: ", nowdata.Name, newscore, newtime)
	w.WriteHeader(http.StatusOK)
}

func updateRanks() {
	db := OpenDB()
	defer db.Close()

	// var maxID int
	// err := db.QueryRow("SELECT MAX(id) FROM scores").Scan(&maxID)
	// if err != nil {
	// 	log.Println("Error fetching max ID:", err)
	// 	return
	// }

	// fmt.Printf("Highest ID: %d\n", maxID)

	rows, err := db.Query("SELECT id FROM scores ORDER BY score DESC;")
	if err != nil {
		log.Println("Error fetching IDs:", err)
		return
	}
	defer rows.Close()

	var ids []int
	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			log.Println("Error scanning ID:", err)
			return
		}
		ids = append(ids, id)
	}
	fmt.Println(ids)
	db_id := 0
	rank := 1
	for db_id < len(ids) {

		_, err = db.Exec("UPDATE scores SET rank = ? WHERE id = ?", rank, ids[db_id])
		if err != nil {
			log.Println("Error updating rank:", err)
			continue
		}
		fmt.Println(ids[db_id], rank)
		rank++

		db_id++
	}

	// rows, err := db.Query("SELECT rank, id FROM scores ORDER BY score DESC;")
	// if err != nil {
	// 	log.Println("query failed:  --> ", err)
	// 	return
	// }
	// if rows == nil {
	// 	log.Println("Query returned no rows")
	// 	return
	// }
	// rank := 1
	// lala := rows
	// rows.Close()
	// defer lala.Close()
	// for lala.Next() {
	// 	currUser := User{}
	// 	err := lala.Scan(&currUser.Rank, &currUser.Id)
	// 	if err != nil {
	// 		log.Println("Error scanning row:", err)
	// 		continue
	// 	}

	// 	// Update the rank in the database for the current row
	// 	_, err = db.Exec("UPDATE scores SET rank = ? WHERE id = ?", rank, currUser.Id)
	// 	if err != nil {
	// 		log.Println("Error updating rank:", err)
	// 		continue
	// 	}
	// 	fmt.Println(currUser, rank)
	// 	rank++
	// }

}

func OpenDB() *sql.DB {
	db, err := sql.Open("sqlite3", "scores.db")
	if err != nil {
		log.Println(err)
	}
	return db
}

type User struct {
	Id        int
	Name      string `json:"name"`
	Score     int    `json:"score"`
	Time      float64
	Rank      int
	SessionId string
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request, c *http.Cookie) User {
	db := OpenDB()
	defer db.Close()
	var currentUserData User
	//- Retrieves the current logged-in user based on their session cookie.
	err := db.QueryRow("SELECT id, name, score, time, rank FROM scores WHERE sessionID=?;", c.Value).Scan(&currentUserData.Id, &currentUserData.Name, &currentUserData.Score, &currentUserData.Time, &currentUserData.Rank)
	if err != nil {
		log.Println(err)
	}
	return currentUserData
}

func creatdb() {
	db, err := sql.Open("sqlite3", "scores.db")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	// SQL query to create the 'scores' table
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS scores (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT ,
		score INTEGER ,
		time FLOAT ,
		rank INTEGER ,
		sessionID TEXT NOT NULL
	);
	`

	// Execute the query
	_, err = db.Exec(createTableQuery)
	if err != nil {
		log.Fatalf("Error creating table: %v", err)
	}

	log.Println("Table 'scores' created successfully!")
}

func insertData() {
	db, err := sql.Open("sqlite3", "scores.db")
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	defer db.Close()

	// SQL query to insert data into the 'scores' table
	insertQuery := `INSERT INTO scores (name, score, time, rank, sessionID)
	VALUES (?, ?, ?, ?, ?)`

	// Data to be inserted
	data := []struct {
		name      string
		score     int
		time      float64
		rank      int
		sessionID string
	}{
		{"Player1", 50, 1.5, 1, "session123"},
		{"Player2", 10, 0.5, 2, "session123"},
		{"Player3", 66, 3.5, 3, "session123"},
	}

	// Loop through the data and execute the insert query for each row
	for _, row := range data {
		_, err := db.Exec(insertQuery, row.name, row.score, row.time, row.rank, row.sessionID)
		if err != nil {
			log.Fatalf("Error inserting data: %v", err)
		}
	}

	log.Println("Data inserted successfully!")
}
