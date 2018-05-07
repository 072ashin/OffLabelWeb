function [F, J] = distance2cone(x, P)
% Calculate modified signed distance of each point in each row of P to the cylinder
% parameterized by x = (rho phi zeta alpha k)
% Input:
%     x : tuple of 5 real numbers (rho phi zeta alpha k) describing the cylinder
%     P : n queries of 3-D points of size n * 3
% Output:
%     F is of size n * 1 are the modified signed distances corresponding to each point in P
%     J is of size n * 5 are the Jacobian of F with respect to x
    rho = x(1); phi = x(2); zeta = x(3); sigma = x(4); tau = x(5); k = x(6);
    n = [cos(phi) * sin(zeta), sin(phi) * sin(zeta), cos(zeta)];
    a = [cos(sigma) * sin(tau), sin(sigma) * sin(tau), cos(tau)];
    p_hat = P - rho * repmat(n, size(P, 1), 1);
    n_cross_a_square = (cross(n, a, 2)) * (cross(n, a, 2))';
    lambda = (n_cross_a_square * sum(p_hat .^ 2, 2) - (dot(p_hat, repmat(a, size(P, 1), 1), 2)) .^ 2) / 2;
    xi = -dot(p_hat, repmat(n, size(P, 1), 1), 2) * n_cross_a_square;
    mu = dot(p_hat, repmat(a, size(P, 1), 1), 2) * dot(n, a);
    eta = repmat(n_cross_a_square, size(P, 1), 1);
    %F = (k / 2 * (n_cross_a_square * sum(p_hat .^ 2, 2) - (dot(p_hat, repmat(a, size(P, 1), 1), 2)) .^ 2) - dot(p_hat, repmat(n, size(P, 1), 1), 2) * n_cross_a_square) ./ (k * dot(p_hat, repmat(a, size(P, 1), 1), 2) * dot(n, a, 2) + n_cross_a_square);
    F = (k * lambda + xi) ./ (k * mu + repmat(n_cross_a_square, size(P, 1), 1));
    J = zeros(size(P, 1), 6);
    n_phi = [-sin(phi) * sin(zeta), cos(phi) * sin(zeta), 0];
    n_zeta = [cos(phi) * cos(zeta), sin(phi) * cos(zeta), -sin(zeta)];
    a_sigma = [-sin(sigma) * sin(tau), cos(sigma) * sin(tau), 0];
    a_tau = [cos(sigma) * cos(tau), sin(sigma) * cos(tau), -sin(tau)];
    lambda_rho = rho * (n_cross_a_square - 2 * (dot(n, a, 2)) ^ 2) + 2 * dot(P, repmat(a, size(P, 1), 1), 2) * dot(n, a, 2) - dot(P, repmat(n, size(P, 1), 1), 2) * n_cross_a_square;
    lambda_phi = -dot(n_phi, a, 2) * dot(n, a, 2) * sum(p_hat .^ 2, 2) - rho * n_cross_a_square * dot(repmat(n_phi, size(P, 1), 1), P, 2) + 2 * rho * dot(p_hat, repmat(a, size(P, 1), 1), 2) * dot(n_phi, a, 2);
    lambda_zeta = -dot(n_zeta, a, 2) * dot(n, a, 2) * sum(p_hat .^ 2, 2) - rho * n_cross_a_square * dot(repmat(n_zeta, size(P, 1), 1), P, 2) + 2 * rho * dot(p_hat, repmat(a, size(P, 1), 1), 2) * dot(n_zeta, a, 2);
    lambda_sigma = -(dot(n, a_sigma, 2) * dot(n, a, 2) * sum(p_hat .^ 2, 2) + dot(p_hat, repmat(a, size(P, 1), 1), 2) .* dot(p_hat, repmat(a_sigma, size(P, 1), 1), 2));
    lambda_tau = -(dot(n, a_tau, 2) * dot(n, a, 2) * sum(p_hat .^ 2, 2) + dot(p_hat, repmat(a, size(P, 1), 1), 2) .* dot(p_hat, repmat(a_tau, size(P, 1), 1), 2));
    xi_rho = repmat(2 * n_cross_a_square, size(P, 1), 1);
    xi_phi = 2 * dot(n_phi, a, 2) * dot(n, a, 2) - dot(p_hat, repmat(n_phi, size(P, 1), 1), 2) * n_cross_a_square;
    xi_zeta = 2 * dot(n_zeta, a, 2) * dot(n, a, 2) - dot(p_hat, repmat(n_zeta, size(P, 1), 1), 2) * n_cross_a_square;
    xi_sigma = dot(p_hat, repmat(n, size(P, 1), 1), 2) * dot(n, a_sigma, 2) * dot(n, a, 2);
    xi_tau = dot(p_hat, repmat(n, size(P, 1), 1), 2) * dot(n, a_tau, 2) * dot(n, a, 2);
    mu_rho = repmat(-(dot(n, a, 2))^2, size(P, 1), 1);
    mu_phi = dot(n_phi, a, 2) * dot(P - 2 * rho * repmat(n, size(P, 1), 1), repmat(a, size(P, 1), 1), 2);
    mu_zeta = dot(n_zeta, a, 2) * dot(P - 2 * rho * repmat(n, size(P, 1), 1), repmat(a, size(P, 1), 1), 2);
    mu_sigma = dot(p_hat, repmat(a_sigma, size(P, 1), 1), 2) * dot(n, a, 2) + dot(p_hat, repmat(a, size(P, 1), 1), 2) * dot(n, a_sigma, 2);
    mu_tau = dot(p_hat, repmat(a_tau, size(P, 1), 1), 2) * dot(n, a, 2) + dot(p_hat, repmat(a, size(P, 1), 1), 2) * dot(n, a_tau, 2);
    eta_phi = repmat(-2 * dot(n_phi, a, 2) * dot(n, a, 2), size(P, 1), 1);
    eta_zeta = repmat(-2 * dot(n_zeta, a, 2) * dot(n, a, 2), size(P, 1), 1);
    eta_sigma = repmat(-2 * dot(n, a_sigma, 2) * dot(n, a, 2), size(P, 1), 1);
    eta_tau = repmat(-2 * dot(n, a_tau, 2) * dot(n, a, 2), size(P, 1), 1);
    J(:, 1) = ((lambda_rho .* mu - lambda .* mu_rho) * (k ^ 2) + (lambda_rho .* eta + xi_rho .* mu - xi .* mu_rho) * k + xi_rho .* eta) ./ ((mu * k + eta) .^ 2);
    J(:, 2) = ((lambda_phi .* mu - lambda .* mu_phi) * (k ^ 2) + (lambda_phi .* eta + xi_phi .* mu - lambda .* eta_phi - xi .* mu_phi) * k + xi_phi .* eta - xi .* eta_phi) ./ ((mu * k + eta) .^ 2);
    J(:, 3) = ((lambda_zeta .* mu - lambda .* mu_zeta) * (k ^ 2) + (lambda_zeta .* eta + xi_zeta .* mu - lambda .* eta_zeta - xi .* mu_zeta) * k + xi_zeta .* eta - xi .* eta_zeta) ./ ((mu * k + eta) .^ 2);
    J(:, 4) = ((lambda_sigma .* mu - lambda .* mu_sigma) * (k ^ 2) + (lambda_sigma .* eta + xi_sigma .* mu - lambda .* eta_sigma - xi .* mu_sigma) * k + xi_sigma .* eta - xi .* eta_sigma) ./ ((mu * k + eta) .^ 2);
    J(:, 5) = ((lambda_tau .* mu - lambda .* mu_tau) * (k ^ 2) + (lambda_tau .* eta + xi_tau .* mu - lambda .* eta_tau - xi .* mu_tau) * k + xi_tau .* eta - xi .* eta_tau) ./ ((mu * k + eta) .^ 2);
    J(:, 6) = (lambda .* eta - mu .* xi) ./ ((mu * k + eta) .^ 2);
end
