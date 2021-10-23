public class LoanBroker extends RouteBuilder {

    @Override
    public void configure() throws Exception {
        from("direct:main").enrich("getCreditScore").enrich("getBanksList").multicast()
                .to("tr1").to("tr2").to("tr3");
        from("tr1").to("Bank1");
        from("Bank1").bean("Normalizer").aggregate("Aggregator").to("result");
        from("tr2").to("Bank2");
        from("Bank2").bean("Normalizer").aggregate("Aggregator").to("result");
        from("tr3").to("Bank3");
        from("Bank3").bean("Normalizer").aggregate("Aggregator").to("result");
    }
}
