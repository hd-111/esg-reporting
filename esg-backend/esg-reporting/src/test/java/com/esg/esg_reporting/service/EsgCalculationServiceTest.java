
package com.esg.esg_reporting.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EsgCalculationServiceTest {

    private final EsgCalculationService service =
            new EsgCalculationService();

    @Test
    void testCalculateEmployeeTurnover() {

        double result =
                service.calculateEmployeeTurnover(10, 100, 120);

        assertEquals(9.09, result, 0.01);
    }

    @Test
    void testCalculateTrainingHoursPerEmployee() {

        double result =
                service.calculateTrainingHoursPerEmployee(200, 50);

        assertEquals(4.0, result);
    }

    @Test
    void testCalculateRecyclingPercentage() {

        double result =
                service.calculateRecyclingPercentage(75, 100);

        assertEquals(75.0, result);
    }

    @Test
    void testCalculateIndependentBoardPercentage() {

        double result =
                service.calculateIndependentBoardPercentage(4, 10);

        assertEquals(40.0, result);
    }

    @Test
    void testEmployeeTurnoverWhenNoEmployees() {

        double result =
                service.calculateEmployeeTurnover(0, 0, 0);

        assertEquals(0.0, result);
    }

    @Test
    void testTrainingHoursWhenNoEmployees() {

        double result =
                service.calculateTrainingHoursPerEmployee(200, 0);

        assertEquals(0.0, result);
    }

    @Test
    void testRecyclingWhenNoWaste() {

        double result =
                service.calculateRecyclingPercentage(0, 0);

        assertEquals(0.0, result);
    }

    @Test
    void testBoardPercentageWhenNoMembers() {

        double result =
                service.calculateIndependentBoardPercentage(0, 0);

        assertEquals(0.0, result);
    }
}

