# 🚀 Buildathon Scenario: “The Oasis Protocol”

**🎮 Theme:** *Inspired by the immersive universe of Ready Player One, where knowledge, and code are the keys to unlocking ultimate control.*

## 🌐 Scenario Background:

In the year 2045, the OASIS a vast virtual world, has gone dark. An anonymous force has encrypted the Master Key needed to reboot the system. Only the most skilled coders can decode the layers of security and unlock the final Builder Challenge to restore the OASIS to its former glory.

The only path forward lies in getting the control of the OASIS. Unlock the key of the OASIS and enhance your OASIS with the key.

Your team is the last hope. Crack the layers of security, rebuild the platform, and restore the OASIS.

---

## 🛠️ Your Task

1.	**Team Authentication**

    Design and implement a complete authentication layer for teams.
  
    📦 Deliverables:

    -	Team Sign-up: Teams register with a unique name.
    -	Login/Logout: Support authentication (ex: GitHub/Google, etc.). You are only required to implement one authentication method, and no extra marks for additional authentication methods.
    -	Access Control: Only authenticated teams can view challenges.
    -	On successful login, redirect to the algorithmic challenge interface for the hacker.

2.	**Admin Authentication**

    A secure admin login system distinct from the team portal.

    📦 Deliverables:

    -	Admin Login Page: With pre-defined credentials.
    -	Route Protection: Restrict admin-only pages via RBAC.
    -	Logout & Session Management: Clear admin sessions on logout or expiry.

3.	**Admin Dashboard**

    Overview for monitoring platform status and activity.

    📦 Deliverables:

    -	Dashboard with real-time or dynamic stats including:
        -	Registered team count
        -	Active challenges
        -	Total submissions
        -	Leaderboard snapshot\
    -	Consider charting or visual summaries for added usability.

4.	**Admin Challenge Management**

    A full interface for creating and managing challenges where each challenge consists of a algorithmic and buildathon problem.

    📦 Deliverables:
  	
      -	Create/Edit/Delete a Challenges: Each challenge consists of a algorithmic problem and a buildathon problem. The correct output of a algorithmic problem is the flag which will be submitted to unlock the buildathon problem.
      -	Create/Edit/Delete Algorithmic Problem.
      -	Create/Edit/Delete Buildathon Problem.
      -	Create/Delete Flag for the challenge

5.	**Admin Team Management**

    In this section, it should allow admins to view and interact with team data.

    📦 Deliverables:

    -	Team Listing: Display all teams with search/filter by name.
    -	Submission History: View all past submissions per team

6.	**Challenge Portal**

    In this portal, the added questions will be presented to team. First the algorithmic question will be presented. Once they solve it the answer should be submitted as the flag. Once the valid flag is submitted to the platform, the buildathon question will be revealed to the player. A zip file of the source code must be submitted to the platform to pass to the next challenge.

    📦 Deliverables:

    -	Algorithmic Challenge Page:
        -	Problem description with constraints
        -	Code editor (No need of syntax highlighting) and language selection
        -	Code Execution via integrated Judge0 CE API (Credentials are provided below)
        -	Display code output/error
        -	Display code execution status
    -	FLAG Submission & Validation:
        -	Submit the flag and validate to unlock the buildathon phase
    -	Buildathon Challenge Reveal:
        -	Display the buildathon task
        -	Teams must upload a Github link for the source code via submission interface

7.	**Team Leaderboard**
    
    Rank teams based on progress and time.

    📦 Deliverables:

    -	Leaderboard displaying:
        -	Team Name
        -	Total Points
      
8. **Submission**

    Once completed building, our team will provide a form where you have to submit the following:

    📦 Deliverables:

    - Youtube Link (Walkthrough Video of the platform)
    - Github Repo Link (Source code of the platform you've built)
 
## Mark Allocation Areas

Throughout this Buildathon, your marks will be allocated for the following areas:

- **Team Authentication:** Implementation of the full authentication flow for participant teams.

  Evaluation Criteria:

  - Unique team registration with validations
  - Secure session handling (login/logout)

- **Challenge Portal**: Implementation of the challenge portal for participants and management system for admins.

  Evaluation Criteria:

    - Algorithmic challenge page: problem rendering, code editor, language selection
    - Integration with Judge0 for code execution and flag validation
    - Progressive unlocking of buildathon challenges upon correct flag submission
    - Buildathon upload interface: GitHub link validation and submission handling

- **Leaderboard**: Real-time or dynamic leaderboard tracking team progress and performance. 
    
  Evaluation Criteria:

    - Display of team names, points, and progress status
    - Ranking based on correct submissions and timestamps

- **Admin Dashboard**: Centralized interface for admin monitoring and control.

  Evaluation Criteria:

    - Pre-authenticated, protected admin access
    - Competition stats (e.g., team count, submissions, leaderboard snapshot)
    - Admin-only access with RBAC enforcement
    - Admin team management: view/search/filter teams and submission history

- **Database**: Backend data management and schema design.

  Evaluation Criteria:

    - Implementation of the database
    - Proper Database connection
  
- **Video**: Team-submitted demo video explaining and showcasing the platform.

  Evaluation Criteria:

  - Clear walkthrough of major features
  - UI/UX showcased with working authentication, challenge, and leaderboard flow
  - Demonstration of backend interactions and Judge0 integration

- **Team Play**: Assessment of collaboration within the team.

  Evaluation Criteria:

  - The Judges will allocate marks based on how active the team is in each hour of inspection.

- **GitHub Commits**: Evaluated informally to assess coding effort, commit hygiene, and collaboration.

  Evaluation Criteria:

  - Based on how many members have committed from each team.

- **Final Submission**: Quality and completeness of final platform delivery.

  Evaluation Criteria:

  - Includes setup/readme, environment details, and API documentation (if applicable)
  - All components submitted on time and integrated coherently

**Are you ready to crack the code and create the future?**

---

### Judge0 CE API Credentials

- API Endpoint: `http://10.3.5.139:2358/`
- API Token: `ZHVvdGhhbjUuMA==`

Please refer the official Judge0 CE API Documentation: [https://ce.judge0.com/](https://ce.judge0.com/)
