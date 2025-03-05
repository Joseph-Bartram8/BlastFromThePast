public void DNMCA_CTC_05_009_TableRanking() {
    var expandGrid = ImplicitWaitUtils.GetElementByAccessibilityId(_instance1Session, "platformSummaryGrid");
    expandGrid.Click();

    PlatformSummaryUtils.sortPlatformSummaryTableByColumn(_instance1Session, "platformSummaryGrid", 1, true);
    Thread.Sleep(AutomationUtils.SHORT_WAIT);
    List<PlatformSummaryUtils.PlatformSummary> tableContents = PlatformSummaryUtils.GetSummaryTableContent(_instance1Session, "platformSummaryGrid");
    List<int> sortedList = tableContents.OrderByDescending(i => i.MailMessageCount).Select(x => x.MailMessageCount).ToList();
    Assert.IsTrue(sortedList.SequenceEqual(tableContents.Select(x => x.MailMessageCount).ToList()));

    List<TopPlatformSummary> topMailMessages = RadioNetAnalysisUtils.GetSummaryTableContent(_instance1Session, "topMailTable");
    Assert.AreEqual(tableContents[0].CallSign, topMailMessages[0].CallSign);
    Assert.AreEqual(tableContents[1].CallSign, topMailMessages[1].CallSign);
    Assert.IsTrue(tableContents.Where(x => x.MailMessageCount.ToString() == topMailMessages[2].Value).Where(y => y.CallSign == topMailMessage[2].CallSign).Any());
    Assert.AreEqual(tableContents[0].MailMessageCount.ToString(), topMailMessages[0].Value);
    Assert.AreEqual(tableContents[1].MailMessageCount.ToString(), topMailMessages[1].Value);
    Assert.AreEqual(tableContents[2].MailMessageCount.ToString(), topMailMessages[2].Value);
}



public static List<PlatformSummary> GetSummaryTableContent(WindowsDriver<WindowsElement> session, string identifier, bool tableSelected = false) {
    List<PlatformSummary> results = null;
    var table = ImplicitWaitUtils.GetElementByAccessibilityId(session, identifier);

    //click on datagrid to ensure data visible
    Actions builder = new Actions(session);
    if (!tableSelected) {
        table.Click();
    }

    // check if table contains info, doing a table copy on an empty table does not override clipboard
    var tableElements = table.FindElementsByXPath("//Pane[@ClassName=\"CellsPanel\"]/DataItem[@ClassName=\"CellControl\"]");
    if (tableElements.Count > 0) {
        builder = new Actions(session);

        //loads table contents into clipboard, best way to get table contents
        builder.MoveToElement(table, 3, 3, MoveToElementOffsetOrigin.TopLeft).ContextClick().SendKeys(Keys.ArrowDown).SendKeys(Keys.ArrowDown).SendKeys(Keys.ArrowDown).SendKeys(Keys.Enter).Build().Perform();
        var data = System.Windows.Forms.Clipboard.GetText();
        string[] entries = data.Split(new string[] { "\r\n" }, StringSplitOptions.None);
        results = new List<PlatformSummary>();
        for (int i = 1; i < entries.Length - 1; i++) {
            string[] values = entries[i].Split(new string[] { "\t" }, StringSplitOptions.None);
            PlatformSummary result = PopulatePlatformSummaryResults(values);
            results.Add(result);
        }
        return results;
    }
}