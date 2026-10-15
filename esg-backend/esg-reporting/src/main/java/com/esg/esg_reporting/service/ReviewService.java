package com.esg.esg_reporting.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esg.esg_reporting.entity.Review;
import com.esg.esg_reporting.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository repository;

    public Review saveReview(Review review) {
        return repository.save(review);
    }

    public List<Review> getAllReviews() {
        return repository.findAll();
    }

    public Review getReviewById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }
}