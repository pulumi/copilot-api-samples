package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type CloudContext struct {
	OrgID string `json:"orgId"`
	URL   string `json:"url"`
}

type Client struct {
	CloudContext CloudContext `json:"cloudContext"`
}

type State struct {
	Client Client `json:"client"`
}

type RequestBody struct {
	ConversationID string `json:"conversationId,omitempty"`
	Query          string `json:"query"`
	State          State  `json:"state"`
}

type MessageContent struct {
	StringContent  string   `json:"-"`
	ArrayContent   []string `json:"-"`
	IsArrayContent bool     `json:"-"`
}

func (mc *MessageContent) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err == nil {
		mc.StringContent = s
		mc.IsArrayContent = false
		return nil
	}

	var a []string
	if err := json.Unmarshal(data, &a); err == nil {
		mc.ArrayContent = a
		mc.IsArrayContent = true
		return nil
	}

	return fmt.Errorf("content must be either string or array of strings")
}

type Message struct {
	Role    string         `json:"role"`
	Content MessageContent `json:"content"`
	Kind    string         `json:"kind,omitempty"`
}

type Program struct {
	Code     string `json:"code"`
	Language string `json:"language"`
	Plan     struct {
		Instructions string `json:"instructions"`
	} `json:"plan"`
}

type Response struct {
	ConversationID string    `json:"conversationId"`
	Messages       []Message `json:"messages"`
	Programs       []Program `json:"programs,omitempty"`
}

func main() {
	copilotURL := os.Getenv("PULUMI_COPILOT_URL")
	accessToken := os.Getenv("PULUMI_ACCESS_TOKEN")

	if copilotURL == "" || accessToken == "" {
		fmt.Println("Error: PULUMI_COPILOT_URL and PULUMI_ACCESS_TOKEN environment variables must be set")
		os.Exit(1)
	}

	fmt.Print("Enter your organization: ")
	orgID, err := readLine()
	if err != nil {
		fmt.Printf("Error reading organization: %v\n", err)
		os.Exit(1)
	}

	var conversationID string
	fmt.Println("\nEnter your questions (press Enter twice to exit):")

	for {
		fmt.Print("\nYou: ")
		query, err := readLine()
		if err != nil {
			fmt.Printf("Error reading query: %v\n", err)
			continue
		}

		if query == "" {
			fmt.Println("Goodbye!")
			break
		}

		response, err := makeRequest(copilotURL, accessToken, query, orgID, conversationID)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			continue
		}

		conversationID = response.ConversationID

		// Print normal assistant responses
		for _, msg := range response.Messages {
			if msg.Role == "assistant" && msg.Kind == "" {
				fmt.Printf("\nAssistant: %s\n", msg.Content.StringContent)
			}
		}

		// Print program information if available
		if len(response.Programs) > 0 {
			for _, program := range response.Programs {
				fmt.Printf("\nInstructions:\n%s\n", program.Plan.Instructions)
				fmt.Printf("\nLanguage: %s\n", program.Language)
				fmt.Printf("\nCode:\n%s\n", program.Code)
			}
		}
	}
}

func makeRequest(url, token, query, orgID, conversationID string) (*Response, error) {
	requestBody := RequestBody{
		Query: query,
		State: State{
			Client: Client{
				CloudContext: CloudContext{
					OrgID: orgID,
					URL:   "https://app.pulumi.com",
				},
			},
		},
	}

	if conversationID != "" {
		requestBody.ConversationID = conversationID
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return nil, fmt.Errorf("error marshaling JSON: %v", err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	req.Header.Add("Authorization", "token "+token)
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received status code %d. Response body: %s", resp.StatusCode, string(body))
	}

	var response Response
	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, fmt.Errorf("error parsing response: %v", err)
	}

	return &response, nil
}

func readLine() (string, error) {
	var input string
	_, err := fmt.Scanln(&input)
	if err != nil {
		input, err = bufio.NewReader(os.Stdin).ReadString('\n')
		if err != nil {
			return "", err
		}
	}
	return strings.TrimSpace(input), nil
}
