package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer"
	"github.com/aws/aws-sdk-go-v2/service/costexplorer/types"
	"github.com/tsabunkar/admin/internal/jwt"
	"github.com/tsabunkar/admin/internal/totp"
)

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	TOTPCode string `json:"totp_code"`
}

type loginResponse struct {
	Token string `json:"token"`
}

type errorResponse struct {
	Error string `json:"error"`
}

type youtubeApiResponse struct {
	Items []struct {
		Statistics struct {
			SubscriberCount string `json:"subscriberCount"`
			VideoCount      string `json:"videoCount"`
			ViewCount       string `json:"viewCount"`
		} `json:"statistics"`
	} `json:"items"`
}

type youtubeMetricsResponse struct {
	SubscriberCount string `json:"subscriberCount"`
	VideoCount      string `json:"videoCount"`
	ViewCount       string `json:"viewCount"`
}


var (
	adminUsername    string
	adminPassword    string
	jwtSecret        string
	totpSecret       string
	githubToken      string
	youtubeApiKey    string
	ceClient         *costexplorer.Client
)

func init() {
	adminUsername = os.Getenv("ADMIN_USERNAME")
	adminPassword = os.Getenv("ADMIN_PASSWORD")
	jwtSecret = os.Getenv("JWT_SECRET")
	totpSecret = os.Getenv("TOTP_SECRET")
	if adminUsername == "" || adminPassword == "" || jwtSecret == "" {
		panic("ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET must be set")
	}

	githubToken = os.Getenv("GITHUB_TOKEN")
	if githubToken == "" {
		log.Println("GITHUB_TOKEN not set, /github-contributions will return an error")
	}

	youtubeApiKey = os.Getenv("YOUTUBE_API_KEY")
	if youtubeApiKey == "" {
		log.Println("YOUTUBE_API_KEY not set, /youtube-metrics will return an error")
	}

	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Println("AWS credentials not available, /cost-explorer will return 503:", err)
	} else {
		ceClient = costexplorer.NewFromConfig(cfg)
	}
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "http://localhost:5173"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func jwtMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			respond(w, http.StatusUnauthorized, errorResponse{Error: "missing Authorization header"})
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		if tokenStr == auth {
			respond(w, http.StatusUnauthorized, errorResponse{Error: "invalid Authorization format"})
			return
		}
		if _, err := jwt.Verify(jwtSecret, tokenStr); err != nil {
			respond(w, http.StatusUnauthorized, errorResponse{Error: "invalid or expired token"})
			return
		}
		next(w, r)
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		respond(w, http.StatusMethodNotAllowed, errorResponse{Error: "method not allowed"})
		return
	}

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respond(w, http.StatusBadRequest, errorResponse{Error: "invalid request body"})
		return
	}
	if req.Username == "" || req.Password == "" {
		respond(w, http.StatusBadRequest, errorResponse{Error: "username and password required"})
		return
	}
	if req.Username != adminUsername || req.Password != adminPassword {
		respond(w, http.StatusUnauthorized, errorResponse{Error: "invalid credentials"})
		return
	}

	if totpSecret != "" {
		if req.TOTPCode == "" {
			respond(w, http.StatusUnauthorized, errorResponse{Error: "TOTP code required"})
			return
		}
		if !totp.ValidateCode(totpSecret, req.TOTPCode) {
			respond(w, http.StatusUnauthorized, errorResponse{Error: "invalid TOTP code"})
			return
		}
	}

	token, err := jwt.Sign(jwtSecret, req.Username, time.Hour)
	if err != nil {
		respond(w, http.StatusInternalServerError, errorResponse{Error: "internal error"})
		return
	}

	respond(w, http.StatusOK, loginResponse{Token: token})
}

func handleCostExplorer(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respond(w, http.StatusMethodNotAllowed, errorResponse{Error: "method not allowed"})
		return
	}
	if ceClient == nil {
		respond(w, http.StatusServiceUnavailable, errorResponse{Error: "AWS credentials not configured"})
		return
	}

	now := time.Now()
	start := time.Date(now.Year(), now.Month()-11, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(now.Year(), now.Month()+1, 0, 0, 0, 0, 0, time.UTC)
	startStr, endStr := start.Format("2006-01-02"), end.Format("2006-01-02")

	input := &costexplorer.GetCostAndUsageInput{
		TimePeriod: &types.DateInterval{Start: &startStr, End: &endStr},
		Granularity: types.GranularityDaily,
		Metrics:     []string{"UnblendedCost"},
		GroupBy: []types.GroupDefinition{
			{Type: types.GroupDefinitionTypeDimension, Key: stringPtr("SERVICE")},
		},
	}

	result, err := ceClient.GetCostAndUsage(context.Background(), input)
	if err != nil {
		respond(w, http.StatusInternalServerError, errorResponse{Error: err.Error()})
		return
	}

	respond(w, http.StatusOK, result)
}

func handleGitHubContributions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respond(w, http.StatusMethodNotAllowed, errorResponse{Error: "method not allowed"})
		return
	}
	if githubToken == "" {
		respond(w, http.StatusBadRequest, errorResponse{Error: "GITHUB_TOKEN not configured"})
		return
	}

	username := os.Getenv("GITHUB_USERNAME")
	if username == "" {
		username = "tsabunkar"
	}

	query := `
		query($username: String!) {
			user(login: $username) {
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								contributionCount
								date
							}
						}
					}
				}
			}
		}`

	body := map[string]interface{}{
		"query": query,
		"variables": map[string]string{"username": username},
	}
	payload, _ := json.Marshal(body)

	req, err := http.NewRequestWithContext(r.Context(), "POST", "https://api.github.com/graphql",
		bytes.NewReader(payload))
	if err != nil {
		respond(w, http.StatusInternalServerError, errorResponse{Error: "internal error"})
		return
	}
	req.Header.Set("Authorization", "Bearer "+githubToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		respond(w, http.StatusBadGateway, errorResponse{Error: fmt.Sprintf("github api error: %v", err)})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	var result interface{}
	if err := json.Unmarshal(respBody, &result); err != nil {
		respond(w, http.StatusBadGateway, errorResponse{Error: "invalid github response"})
		return
	}

	respond(w, resp.StatusCode, result)
}

func handleYouTubeMetrics(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		respond(w, http.StatusMethodNotAllowed, errorResponse{Error: "method not allowed"})
		return
	}
	if youtubeApiKey == "" {
		respond(w, http.StatusBadRequest, errorResponse{Error: "YOUTUBE_API_KEY not configured"})
		return
	}

	handle := os.Getenv("YOUTUBE_HANDLE")
	if handle == "" {
		handle = "@tsabunkar"
	}

	url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=%s&key=%s", handle, youtubeApiKey)

	resp, err := http.Get(url)
	if err != nil {
		respond(w, http.StatusBadGateway, errorResponse{Error: fmt.Sprintf("youtube api error: %v", err)})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		respond(w, resp.StatusCode, errorResponse{Error: fmt.Sprintf("youtube api returned %d: %s", resp.StatusCode, string(respBody))})
		return
	}

	var apiResp youtubeApiResponse
	if err := json.Unmarshal(respBody, &apiResp); err != nil {
		respond(w, http.StatusBadGateway, errorResponse{Error: "invalid youtube response"})
		return
	}

	if len(apiResp.Items) == 0 {
		respond(w, http.StatusNotFound, errorResponse{Error: "channel not found"})
		return
	}

	stats := apiResp.Items[0].Statistics
	result := youtubeMetricsResponse{
		SubscriberCount: stats.SubscriberCount,
		VideoCount:      stats.VideoCount,
		ViewCount:       stats.ViewCount,
	}

	respond(w, http.StatusOK, result)
}


func respond(w http.ResponseWriter, status int, body interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(body)
}

func stringPtr(s string) *string { return &s }

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/login", handleLogin)
	mux.HandleFunc("/cost-explorer", jwtMiddleware(handleCostExplorer))
	mux.HandleFunc("/github-contributions", jwtMiddleware(handleGitHubContributions))
	mux.HandleFunc("/youtube-metrics", jwtMiddleware(handleYouTubeMetrics))


	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting localserver on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, cors(mux)))
}
