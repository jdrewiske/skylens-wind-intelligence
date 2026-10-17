# SkyLens Google Forms pricing survey setup

This setup script creates a Google Form and a linked Google Sheets response workbook in your Google account. The survey asks the four Van Westendorp price thresholds, activity/sport, activity frequency, smart-glasses compatibility, product interest, email address, and optional permission to receive updates.

## Create the real survey

1. Sign in to the Google account that should own the survey.
2. Open [Google Apps Script](https://script.google.com).
3. Choose **New project**.
4. Open `Code.gs`, select the starter code, and replace it with the contents of this repository's `google-forms-setup/Code.gs` file.
5. Save the project.
6. In the function dropdown, select `createSkyLensPricingSurvey`, then click **Run**.
7. Review and approve the Google permissions. The script creates a form and a spreadsheet in your account.
8. Open the run's **Execution log** and copy the values for:
   - `SURVEY RESPONDENT URL`
   - `FORM EDIT URL`
   - `RESPONSE SPREADSHEET URL`
9. Open the respondent URL and submit a test response. Confirm that a new row appears in the linked spreadsheet. Do not distribute the survey until this test succeeds.

**Important:** Run the function only once unless you deliberately want to create another form and spreadsheet.

## Email and consent

Email is required and stored in the same response row as the pricing answers, as requested. Permission to receive occasional updates is a separate, optional checkbox. Use the email only in line with that consent and your project's applicable privacy requirements. Respondents should know that email is associated with their answers.

## Connect the landing page

Once the respondent URL exists and the test submission is visible in the response spreadsheet, provide the **respondent URL** so the website's Join the Waitlist buttons can be linked to the actual form. The survey link must not be guessed or replaced with the edit URL.

## Van Westendorp data notes

The four required monthly price responses are numeric USD values. Before calculating curves, review the data for incomplete, implausible, or inconsistent answers. A typical consistency check is:

- price too cheap < bargain price
- bargain price < expensive price
- expensive price < too expensive price

Do not silently change respondents' answers; flag inconsistent records and document your handling in the analysis. Aim for 30 or more valid completed responses and report the sample size and recruitment method.
