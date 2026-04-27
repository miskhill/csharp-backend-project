# C# Backend Project

This is a very small ASP.NET Core backend starter project since I switched from Node.js and TypeScript to C# and .NET. 

It does two things:

- starts a backend server on `http://localhost:5050`
- returns a simple message from `GET /` so you can confirm the server is running

## Run the server

```bash
cd /Users/garysmith/Repositories/csharp-backend-project
dotnet run
```

Then open `http://localhost:5050` in your browser.

## Project files

- `Program.cs` contains the server setup and the sample route
- `Properties/launchSettings.json` sets the localhost port for local development
- `.gitignore` ignores build output folders
