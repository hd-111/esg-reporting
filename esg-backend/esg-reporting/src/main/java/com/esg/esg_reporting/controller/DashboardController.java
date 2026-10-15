package com.esg.esg_reporting.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.esg.esg_reporting.entity.MetricEntry;
import com.esg.esg_reporting.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/metrics")
    public List<MetricEntry> getAllMetricEntries() {
        return service.getAllMetricEntries();
    }

    @GetMapping("/status-count")
    public Map<String, Long> getMetricCountByStatus() {
        return service.getMetricCountByStatus();
    }
}