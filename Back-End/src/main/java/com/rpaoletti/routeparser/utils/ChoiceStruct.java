package com.rpaoletti.routeparser.utils;

import java.util.ArrayList;
import java.util.List;

public class ChoiceStruct {
    public int lastID;
    public int lastChoiceID;
    public List<Integer> leaves;

    public ChoiceStruct(int lastID) {
        this.lastID = lastID;
        this.lastChoiceID = lastID;
        leaves = new ArrayList<>();
    }
}
