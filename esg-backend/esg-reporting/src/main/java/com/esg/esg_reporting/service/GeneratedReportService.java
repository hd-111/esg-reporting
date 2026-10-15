package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.GeneratedReport;
import com.esg.esg_reporting.repository.GeneratedReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GeneratedReportService {

    private final GeneratedReportRepository repository;

    public GeneratedReport saveGeneratedReport(GeneratedReport report) {
        return repository.save(report);
    }

    public List<GeneratedReport> getAllGeneratedReports() {
        return repository.findAll();
    }

    public GeneratedReport getGeneratedReportById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Generated report not found"));
    }
}