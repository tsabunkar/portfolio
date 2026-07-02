package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/tsabunkar/admin/internal/secrets"
)

type youtubeApiKeySecret struct {
	ApiKey string `json:"api_key"`
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

var secretsClient *secrets.Client
var apiKey string
var httpClient *http.Client

func init() {
	ctx := context.Background()
	var err error
	secretsClient, err = secrets.New(ctx)
	if err != nil {
		panic("failed to init secrets client: " + err.Error())
	}

	var keySecret youtubeApiKeySecret
	if err := secretsClient.GetJSON(ctx, "/admin/youtube-api-key", &keySecret); err != nil {
		panic("failed to read youtube api key: " + err.Error())
	}
	apiKey = keySecret.ApiKey

	httpClient = &http.Client{}
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	handle := os.Getenv("YOUTUBE_HANDLE")
	if handle == "" {
		handle = "@tsabunkar"
	}

	url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=%s&key=%s", handle, apiKey)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return respond(500, map[string]string{"error": "internal error"})
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return respond(502, map[string]string{"error": fmt.Sprintf("youtube api error: %v", err)})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return respond(502, map[string]string{"error": "failed to read youtube response"})
	}

	if resp.StatusCode != 200 {
		return respond(resp.StatusCode, map[string]string{"error": fmt.Sprintf("youtube api returned %d: %s", resp.StatusCode, string(body))})
	}

	var apiResp youtubeApiResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		return respond(502, map[string]string{"error": "invalid youtube response"})
	}

	if len(apiResp.Items) == 0 {
		return respond(404, map[string]string{"error": "channel not found"})
	}

	stats := apiResp.Items[0].Statistics
	result := youtubeMetricsResponse{
		SubscriberCount: stats.SubscriberCount,
		VideoCount:      stats.VideoCount,
		ViewCount:       stats.ViewCount,
	}

	return respond(200, result)
}

func respond(status int, body interface{}) (events.APIGatewayProxyResponse, error) {
	b, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers: map[string]string{
			"Content-Type":                 "application/json",
			"Access-Control-Allow-Origin":  "https://tsabunkar.com",
			"Access-Control-Allow-Headers": "Authorization,Content-Type",
		},
		Body: string(b),
	}, nil
}

func main() {
	lambda.Start(handler)
}
