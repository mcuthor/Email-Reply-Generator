import { useState } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,   
  CircularProgress,
  AppBar,
  Toolbar,
  Paper
} from "@mui/material";
import axios from "axios";
import "./App.css";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === "string" 
          ? response.data 
          : JSON.stringify(response.data, null, 2)
      ); 
    } catch (error) {
      setError("⚠️ Failed to generate reply. Please try again.");
      console.error("Error generating reply:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Bar */}
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ✉️ Smart Email Reply Generator
          </Typography>
        </Toolbar>
      </AppBar>
        
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Generate Smart Replies
          </Typography>

          <Box sx={{ my: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Paste the Email Content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Formal">Formal</MenuItem>
                <MenuItem value="Casual">Casual</MenuItem>
                <MenuItem value="Friendly">Friendly</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={loading || !emailContent}
              fullWidth
              sx={{ py: 1.2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "🚀 Generate Reply"}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {generatedReply && (
            <Paper 
              elevation={2} 
              sx={{ mt: 4, p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                ✨ Generated Reply:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                📋 Copy to Clipboard
              </Button>
            </Paper>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default App;
