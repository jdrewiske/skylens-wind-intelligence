/**
 * SkyLens Van Westendorp Pricing Survey — Google Apps Script setup
 *
 * HOW TO USE:
 * 1. Open https://script.google.com while signed in to the Google account that should own the survey.
 * 2. Create a new project and replace the editor contents with this file.
 * 3. Save, choose createSkyLensPricingSurvey in the function menu, and click Run.
 * 4. Review the requested permissions and authorize.
 * 5. Open the execution log to retrieve the live survey URL and linked response spreadsheet URL.
 *
 * Run once only. Each run creates a NEW form and spreadsheet.
 */
function createSkyLensPricingSurvey() {
  const form = FormApp.create('SkyLens Wind Intelligence — Pricing Survey');
  form.setDescription(
    'Help us understand interest in SkyLens, a proposed smart-glasses companion that gives outdoor athletes quick context about wind direction, speed, and gusts. This is a product concept, not a currently available service. Please answer based on the assumption that it works reliably with compatible smart glasses. Pricing questions refer to US dollars per month. Estimated time: 2–3 minutes.'
  );
  form.setConfirmationMessage(
    'Thank you for helping evaluate SkyLens! Your response has been submitted. Pricing answers will be analyzed in aggregate for a student product-research project.'
  );
  form.setProgressBar(true);
  form.setShowLinkToRespondAgain(false);

  form.addMultipleChoiceItem()
    .setTitle('1. Which outdoor activity do you participate in most?')
    .setChoiceValues(['Golf', 'Tennis', 'Running', 'Cycling', 'Other outdoor sports'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('2. How often do you participate in this activity?')
    .setChoiceValues(['Daily', '2–3 times per week', 'About once a week', 'A few times per month', 'Less often'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3. Do you own or would you consider using compatible smart glasses?')
    .setChoiceValues([
      'I already own compatible glasses',
      'I might consider them',
      'I am not interested in smart glasses',
      'I would need more information'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('4. How useful would wind information at a glance be during your activity?')
    .setBounds(1, 5)
    .setLabels('1 — Not useful', '5 — Extremely useful')
    .setRequired(true);

  const priceValidation = FormApp.createTextValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setHelpText('Enter a number of US dollars per month, such as 3.99. Use 0 if you would only consider it free.')
    .build();

  form.addTextItem()
    .setTitle('5. At what monthly price would SkyLens be so cheap that you would question its quality? (USD/month)')
    .setHelpText('Enter a number, e.g. 1.99')
    .setValidation(priceValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('6. At what monthly price would SkyLens be a bargain — a great deal for the money? (USD/month)')
    .setHelpText('Enter a number, e.g. 3.99')
    .setValidation(priceValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('7. At what monthly price would SkyLens start to feel expensive, but you might still consider it? (USD/month)')
    .setHelpText('Enter a number, e.g. 7.99')
    .setValidation(priceValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('8. At what monthly price would SkyLens be too expensive to consider? (USD/month)')
    .setHelpText('Enter a number, e.g. 12.99')
    .setValidation(priceValidation)
    .setRequired(true);

  form.addTextItem()
    .setTitle('9. Email address (required for this combined pricing survey and waitlist)')
    .setHelpText('Your email will be stored alongside your survey answers. Please provide an address you are comfortable sharing with the SkyLens project team.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().setHelpText('Enter a valid email address.').build())
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('10. Optional: I agree to receive occasional SkyLens project updates at the email address above.')
    .setChoiceValues(['Yes, email me occasional SkyLens updates'])
    .setRequired(false);

  const spreadsheet = SpreadsheetApp.create('SkyLens Pricing Survey — Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  Logger.log('SURVEY RESPONDENT URL: ' + form.getPublishedUrl());
  Logger.log('FORM EDIT URL: ' + form.getEditUrl());
  Logger.log('RESPONSE SPREADSHEET URL: ' + spreadsheet.getUrl());
  Logger.log('IMPORTANT: Submit one test response using the respondent URL and confirm it appears as a new row in the spreadsheet before sharing the survey.');
}
