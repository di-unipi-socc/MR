# MR - Frontend

The **frontend** of MR is implemented in Angular and it consists of a reactive web page made by multiple Angular components, all contained in a main component, viz., *AppComponent*, realizing the overall application. 
* *FormComponent* implements a form enabling users to load an integration route written in the Java DSL of Apache Camel.
* *GraphComponent* implements a pane in the GUI displaying the graph-based representation of an imported architecture (as well as its highlighting to display the results of run analyses).
* *AddChannelDialogComponent* implements a dialog enabling users to specify the output and input types connected by a channel.
* *ImportTypesDialogComponent* implements a dialog enabling users to import/export all channels' input and output types by loading/downloading them in a JSON format.
* *ParseService* implements the logic for interacting with the **backend** API of MR.
